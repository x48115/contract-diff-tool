import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  hideFiles: "false",
  splitView: true,
};

const slice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setTheme(state, action) {
      console.log("acc", action);
      state.mode = action.payload;
    },
    setHideFiles(state, action) {
      state.hideFiles = action.payload;
    },
    setSplitView(state, action) {
      console.log("zz", action.payload);
      state.splitView = action.payload;
    },
  },
});

export const { setTheme, setSplitView, setHideFiles } = slice.actions;
export const selectTheme = (state) => state.options.mode;
export const selectHideFiles = (state) => state.options.hideFiles;
export const selectSplitView = (state) => state.options.splitView;

export default slice.reducer;
