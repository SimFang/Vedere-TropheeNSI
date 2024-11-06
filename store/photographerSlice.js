import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: {
    type: '',      // string
    expertise: '', // string
    distance: 0,   // number
  },
  photographers: [],  // photographers pile (list)
  isPhotographer: false,
  displayedOrderId: "null"
};

const photographerSlice = createSlice({
  name: 'photographer',
  initialState,
  reducers: {
    setDisplayedOrder: (state, action) => {
      state.displayedOrderId = action.payload;
    },
    clearDisplayedOrder: (state) => {
      state.displayedOrderId = "";
    },
    setIsPhotgrapher: (state, action) => {
      state.isPhotographer = action.payload;
    },
    changeFilterExpertise: (state, action) => {
      state.filters.expertise = action.payload;
    },
    changeFilterDistance: (state, action) => {
      state.filters.distance = action.payload;
    },
    changeFilterType: (state, action) => {
      state.filters.type = action.payload;
    },
    clearFilters: (state) => {
      state.filters = { ...initialState.filters };
    },
    prioritizePhotographer: (state, action) => {
      const photographerIndex = state.photographers.findIndex(p => p.id === action.payload);
      if (photographerIndex !== -1) {
        const photographer = state.photographers.splice(photographerIndex, 1)[0];
        state.photographers.unshift(photographer);
      }
    },
    addPhotographer: (state, action) => {
      state.photographers.push(action.payload);
    },
    setPhotographer: (state, action) => {
      state.photographers = action.payload;
    },
    resetPhotographerState: (state) => {
      // Reset everything except isPhotographer
      state.filters = { ...initialState.filters };
      state.photographers = [];
      state.displayedOrderId = "null"; // You may want to keep this as well
    }
  },
});

export const {
  setDisplayedOrder,
  clearDisplayedOrder,
  setIsPhotgrapher,
  setPhotographer,
  changeFilterExpertise,
  changeFilterDistance,
  changeFilterType,
  clearFilters,
  prioritizePhotographer,
  addPhotographer,
  resetPhotographerState, // Export the reset action
} = photographerSlice.actions;

export default photographerSlice.reducer;
