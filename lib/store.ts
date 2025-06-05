// lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { signUp, logIn, porfileEdit, userApi } from "./api";

export const store = configureStore({
  reducer: {
    [signUp.reducerPath]: signUp.reducer,
    [logIn.reducerPath]: logIn.reducer,
    [porfileEdit.reducerPath]: porfileEdit.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      signUp.middleware,
      logIn.middleware,
      porfileEdit.middleware,
      userApi.middleware
    ),
});

// 타입 추론용
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;