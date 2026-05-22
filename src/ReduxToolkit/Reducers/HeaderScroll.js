import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    down: false,
    up: false
};

const HeaderScroll = createSlice({
  name: "headerScroll",
  initialState,
  reducers: {
    GET_SCROLLHEADER: (state) => {
      state.down = true;
      state.up = true;
    },
  },
});

export const { GET_SCROLLHEADER } = HeaderScroll.actions;
export default HeaderScroll.reducer;
