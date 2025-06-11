// lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api";
import { walletApi } from "./api";
import { tradesApi } from "./api";
import { portfolioApi } from "./api";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
    [tradesApi.reducerPath]: tradesApi.reducer,
    [portfolioApi.reducerPath]: portfolioApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, walletApi.middleware,tradesApi.middleware,
      portfolioApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;