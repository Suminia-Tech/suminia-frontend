import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    compareProducts: []
};

const CompareReducer = createSlice({
  name: "compare",
  initialState,
  reducers: {
    CHANGECOMPARE: (state, action) => {
      state.compareProducts = action.payload;
    },
  },
});

export const { CHANGECOMPARE } = CompareReducer.actions;
export default CompareReducer.reducer;
