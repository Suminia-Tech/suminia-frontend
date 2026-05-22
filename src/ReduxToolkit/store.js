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
  },
});
