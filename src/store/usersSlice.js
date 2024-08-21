import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveUsersToDB, getUsersFromDB, clearUsersFromDB } from '../idb';

// Define async thunk to fetch users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
    
    // Clear old users and save new ones to IndexedDB
    await clearUsersFromDB();
    await saveUsersToDB(data);
    
    return data;
  } catch (error) {
    // If fetching fails, try to get users from IndexedDB
    const offlineUsers = await getUsersFromDB();
    if (offlineUsers.length > 0) {
      return offlineUsers; // Return users from IndexedDB
    }
    return rejectWithValue('Failed to fetch users and no offline data available.');
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
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default usersSlice.reducer;
