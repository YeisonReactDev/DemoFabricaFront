import mainPagesRedux from "@pages/.config/redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { commonSlice } from "./common/redux";

export const store = configureStore({
  reducer: {
    common: commonSlice,
    ...mainPagesRedux.slice,
    //API
    ...mainPagesRedux.api,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ...mainPagesRedux.middlewares,
    ]),
});

setupListeners(store.dispatch);