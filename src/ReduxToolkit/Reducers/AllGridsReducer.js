import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  initialGrid: "row-cols-lg-4 row-cols-md-3",
};

const AllGridReducer = createSlice({
  name: "grid",
  initialState,
  reducers: {
    SET_GRID: (state, action) => {
      state.initialGrid = action.payload;
    },
  },
});

export const { SET_GRID } = AllGridReducer.actions;
export default AllGridReducer.reducer;
