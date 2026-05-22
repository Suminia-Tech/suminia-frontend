import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  portfoliodata: "",
};

const PortfolioReducer = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    GETPORTFOLIODATA: (state, action) => {
      state.portfoliodata = action.payload;
    },
  },
});

export const { GETPORTFOLIODATA } = PortfolioReducer.actions;
export default PortfolioReducer.reducer;
