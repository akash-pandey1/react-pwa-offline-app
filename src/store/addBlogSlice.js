import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveRequest } from '../idb'; // IndexedDB utilities

// Thunk to handle creating a post
export const createPost = createAsyncThunk('posts/createPost', async (post, { rejectWithValue }) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) throw new Error('Failed to create post');
    return await response.json();
  } catch (error) {
    // If the network request fails, save the request to IndexedDB for later syncing
    await saveRequest({
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: post,
    });

    // Return the post for immediate UI update, but with an offline flag
    return { ...post, id: Date.now(), offline: true };
  }
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;
