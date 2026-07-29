import { configureStore } from "@reduxjs/toolkit";
import  ModalReducer  from "./Reducers/ModalReducer";
import  AddToCartReducer  from "./Reducers/AddtoCartReducer";
import  CurrencyReducer  from "./Reducers/CurrencyReducer";
import  HeaderScroll  from "./Reducers/HeaderScroll";
import  BlogReducer  from "./Reducers/BlogReducer";
import  PortfolioReducer  from "./Reducers/PortfolioReducer";
import  AllGridReducer  from "./Reducers/AllGridsReducer";
import  ProductFilter  from "./Reducers/ProductFilterReducer";
import  CommonReducer  from "./Reducers/AllReducer";
import  CompareReducer  from "./Reducers/CompareReducer";
import  ThemeCustomizerReducer  from "./Reducers/ThemeCustomizerReducer";
import authReducer from "./authSlice";
import { suminiaApi } from "@/services/suminiaApi";
import { firebaseApi } from "@/services/firebaseApi";

export const store = configureStore({
  reducer: {
    HeaderScroll,
    ModalReducer,
    AddToCartReducer,
    BlogReducer,
    PortfolioReducer,
    AllGridReducer,
    ProductFilter,
    CommonReducer,
    CurrencyReducer,
    CompareReducer,
    ThemeCustomizerReducer,
    auth: authReducer,
    [suminiaApi.reducerPath]: suminiaApi.reducer,
    [firebaseApi.reducerPath]: firebaseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(suminiaApi.middleware)
      .concat(firebaseApi.middleware),
});
