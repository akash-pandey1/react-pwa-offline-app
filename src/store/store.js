import { configureStore } from '@reduxjs/toolkit';
import blogsReducer from './blogSlice';
import usersReducer from './usersSlice';

export const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    users: usersReducer,
  },
});
