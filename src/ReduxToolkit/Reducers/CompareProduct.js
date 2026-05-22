import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    compareProducts: []
};

const compareProductSlice = createSlice({
  name: "compareProduct",
  initialState,
  reducers: {
    CHANGECOMPARE: (state, action) => {
      state.compareProducts = action.payload;
    },
  },
});

export const { CHANGECOMPARE } = compareProductSlice.actions;
export default compareProductSlice.reducer;
