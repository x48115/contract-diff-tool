import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  network: 1,
};

const slice = createSlice({
  name: "swap",
  initialState,
  reducers: {
    setNetwork(state, action) {
      state.network = action.payload;
    },
  },
});

export const { setNetwork } = slice.actions;
export const selectNetwork = (state) => state.swap.network;

export default slice.reducer;
