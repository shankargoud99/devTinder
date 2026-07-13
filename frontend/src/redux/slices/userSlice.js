import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => action.payload,
    removeUser: () => null,
    updateUser: (state, action) => ({ ...state, ...action.payload }),
  },
});

export const { addUser, removeUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
