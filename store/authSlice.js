import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  language: 'en', // Default language
  signUpData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSignUpData(state, action) {
      state.signUpData = action.payload;
    },
    clearSignUpData(state) {
      state.signUpData = null;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    stopLoading(state) {
      state.loading = false;
    },
    loginSuccess(state) {
      state.loading = false;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    signupSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setLanguage(state, action) {
      state.language = action.payload; // Set the language from payload
    },
    resetAuthState(state) {
      // Reset everything except language
      return {
        ...initialState,
        language: state.language, // Preserve the current language
      };
    },
  },
});

// Export actions
export const {
  setSignUpData,
  clearSignUpData,
  setToken,
  stopLoading,
  loginSuccess,
  logout,
  signupSuccess,
  setLanguage,
  resetAuthState, // Export the reset action
} = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
