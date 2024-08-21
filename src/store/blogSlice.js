import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { savePostsToDB, getPostsFromDB, clearPostsFromDB } from '../idb';

// Define async thunk to fetch posts
export const fetchPosts = createAsyncThunk('blogs/fetchPosts', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) throw new Error('Failed to fetch posts');
    const data = await response.json();
    
    // Clear old posts and save new ones to IndexedDB
    await clearPostsFromDB();
    await savePostsToDB(data);
    
    return data;
  } catch (error) {
    // If fetching fails, try to get posts from IndexedDB
    const offlinePosts = await getPostsFromDB();
    if (offlinePosts.length > 0) {
      return offlinePosts; // Return posts from IndexedDB
    }
    return rejectWithValue('Failed to fetch posts and no offline data available.');
  }
});

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: {
    posts: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default blogsSlice.reducer;
