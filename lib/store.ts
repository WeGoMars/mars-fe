// lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api";
import { walletApi } from "./api";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, walletApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;