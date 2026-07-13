import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addRequests: (state, action) => action.payload,
    removeRequest: (state, action) => {
      if (!state) return state;
      return state.filter((r) => r._id !== action.payload);
    },
    clearRequests: () => null,
  },
});

export const { addRequests, removeRequest, clearRequests } = requestSlice.actions;
export default requestSlice.reducer;
