import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blogdata: [],
  Blogdatanew: "",
};

const BlogReducer = createSlice({
  name: "blog",
  initialState,
  reducers: {
    GETBLOGDATA: (state, action) => {
      state.blogdata = action.payload;
      state.Blogdatanew = action.payload;
    },
  },
});

export const { GETBLOGDATA } = BlogReducer.actions;
export default BlogReducer.reducer;
