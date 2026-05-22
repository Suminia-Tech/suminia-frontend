import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Is_Search: false,
    Is_Focus: false
};

const CommonReducer = createSlice({
  name: "common",
  initialState,
  reducers: {
    IS_SEARCH: (state) => {
      state.Is_Search = !state.Is_Search;
    },
    IS_FOCUS: (state, action) => {
      state.Is_Focus = action.payload;
    },
  },
});

export const { IS_SEARCH, IS_FOCUS } = CommonReducer.actions;
export default CommonReducer.reducer;
