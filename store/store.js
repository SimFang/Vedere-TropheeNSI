import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import photographerReducer from './photographerSlice'
import chatReducer from './chatSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    photographer : photographerReducer,
    chat : chatReducer,
  },
});

export default store;
