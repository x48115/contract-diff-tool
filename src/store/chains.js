import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
};

const slice = createSlice({
  name: "chains",
  initialState,
  reducers: {
    setChains(state, action) {
      state.list = action.payload;
    },
  },
});

export const { setChains } = slice.actions;
export const selectChains = (state) => state.chains.list;

export default slice.reducer;
