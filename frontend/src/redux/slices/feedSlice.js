import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => action.payload,
    // Remove a user from the feed after sending them a request (interested/ignored)
    removeUserFromFeed: (state, action) => {
      if (!state) return state;
      return state.filter((user) => user._id !== action.payload);
    },
    clearFeed: () => null,
  },
});

export const { addFeed, removeUserFromFeed, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;
