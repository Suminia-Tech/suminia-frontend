import { createSlice } from "@reduxjs/toolkit";
import { ConfigDB } from "../../Config/ThemeConfigSettings";

const initialState = {
    direction: ConfigDB.layoutDirection,
    mode: ConfigDB.darkMode,
    primaryColor: ConfigDB.primaryColor
};

const ThemeCustomizerReducer = createSlice({
  name: "themeCustomizer",
  initialState,
  reducers: {
    ISDIRECTION: (state, action) => {
      state.direction = action.payload;
    },
    ISMODE: (state, action) => {
      state.mode = action.payload;
    },
    ISPRIMARYCOLOR: (state, action) => {
      state.primaryColor = action.payload;
    },
  },
});

export const { ISDIRECTION, ISMODE, ISPRIMARYCOLOR } = ThemeCustomizerReducer.actions;
export default ThemeCustomizerReducer.reducer;
