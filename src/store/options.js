import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  hideFiles: "false",
  splitView: true,
  network1: 1,
  network2: 1,
  selectedFile: "",
};

const slice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setTheme(state, action) {
      state.mode = action.payload;
    },
    setHideFiles(state, action) {
      state.hideFiles = action.payload;
    },
    setSplitView(state, action) {
      state.splitView = action.payload;
    },
    setNetwork1(state, action) {
      state.network1 = action.payload;
    },
    setNetwork2(state, action) {
      state.network2 = action.payload;
    },
    setSelectedFile(state, action) {
      state.selectedFile = action.payload;
    },
  },
});

export const {
  setTheme,
  setSplitView,
  setHideFiles,
  setNetwork1,
  setNetwork2,
  setSelectedFile,
} = slice.actions;
export const selectTheme = (state) => state.options.mode;
export const selectNetwork1 = (state) => state.options.network1;
export const selectNetwork2 = (state) => state.options.network2;
export const selectHideFiles = (state) => state.options.hideFiles;
export const selectSplitView = (state) => state.options.splitView;
export const selectSelectedFile = (state) => state.options.selectedFile;

// Explorers
export const selectExplorer1 = (state) =>
  state.chains.list.length &&
  state.options.network1 &&
  state.chains.list.find(
    (chain) => chain.chainId === parseInt(state.options.network1)
  ).explorers[0].url;
export const selectExplorer2 = (state) =>
  state.chains.list.length &&
  state.options.network2 &&
  state.chains.list.find(
    (chain) => chain.chainId === parseInt(state.options.network2)
  ).explorers[0].url;

// Chains
export const selectChain1 = (state) =>
  state.chains.list.length &&
  state.options.network1 &&
  state.chains.list.find(
    (chain) => chain.chainId === parseInt(state.options.network1)
  );

export const selectChain2 = (state) =>
  state.chains.list.length &&
  state.options.network2 &&
  state.chains.list.find(
    (chain) => chain.chainId === parseInt(state.options.network2)
  );

export default slice.reducer;
