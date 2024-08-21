




import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveRequest } from '../idb'; // IndexedDB utilities

// Thunk to handle creating a post
export const createUser = createAsyncThunk('users/createPost', async (user, { rejectWithValue }) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) throw new Error('Failed to create post');
    return await response.json();
  } catch (error) {
    // If the network request fails, save the request to IndexedDB for later syncing
    await saveRequest({
      url: 'https://jsonplaceholder.typicode.com/users',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: user,
    });

    // Return the post for immediate UI update, but with an offline flag
    return { ...users, id: Date.now(), offline: true };
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPost.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
