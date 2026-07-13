import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import feedReducer from "./slices/feedSlice";
import connectionReducer from "./slices/connectionSlice";
import requestReducer from "./slices/requestSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionReducer,
    requests: requestReducer,
  },
});

export default store;
