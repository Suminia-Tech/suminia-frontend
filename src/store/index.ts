import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '@/modules/auth';
import { baseApi } from '@/shared/api/baseApi';

/* Reducers heredados de la plantilla Voxo. Se van retirando conforme cada
   pantalla se reemplaza por un feature propio; no agregar nuevos aqui. */
import AddToCartReducer from '@/_template/ReduxToolkit/Reducers/AddtoCartReducer';
import AllGridReducer from '@/_template/ReduxToolkit/Reducers/AllGridsReducer';
import BlogReducer from '@/_template/ReduxToolkit/Reducers/BlogReducer';
import CommonReducer from '@/_template/ReduxToolkit/Reducers/AllReducer';
import CompareReducer from '@/_template/ReduxToolkit/Reducers/CompareReducer';
import CurrencyReducer from '@/_template/ReduxToolkit/Reducers/CurrencyReducer';
import HeaderScroll from '@/_template/ReduxToolkit/Reducers/HeaderScroll';
import ModalReducer from '@/_template/ReduxToolkit/Reducers/ModalReducer';
import PortfolioReducer from '@/_template/ReduxToolkit/Reducers/PortfolioReducer';
import ProductFilter from '@/_template/ReduxToolkit/Reducers/ProductFilterReducer';
import ThemeCustomizerReducer from '@/_template/ReduxToolkit/Reducers/ThemeCustomizerReducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,

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
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
