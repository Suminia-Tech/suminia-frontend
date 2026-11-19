import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { EMPTY_STAFF_FILTERS, type StaffOrderFilters } from '../lib/staffFilters';

/* La pestaña, la pagina y los filtros de cada listado de pedidos. Viven en el
   store y no en la pantalla para que abrir un pedido y volver no deje la
   lista otra vez en "Todos" y en la primera pagina: la pantalla se desmonta
   al entrar al detalle y, con estado propio, arrancaba de cero.

   Uno por listado —el del comprador, el del proveedor, el del personal y cada
   bandeja del dinero—, porque cada uno se filtra a su manera. */

export interface OrdersListState {
  status: string;
  page: number;
  staffFilters: StaffOrderFilters;
}

export const EMPTY_ORDERS_LIST: OrdersListState = {
  status: '',
  page: 1,
  staffFilters: EMPTY_STAFF_FILTERS,
};

type State = Record<string, OrdersListState>;

const ordersListSlice = createSlice({
  name: 'ordersList',
  initialState: {} as State,
  reducers: {
    /* Cambiar la pestaña o los filtros vuelve a la primera pagina: quedarse
       en la 4 tras filtrar suele dejar la lista vacia sin motivo aparente. */
    setOrdersStatus: (state, action: PayloadAction<{ key: string; status: string }>) => {
      const actual = state[action.payload.key] ?? EMPTY_ORDERS_LIST;
      state[action.payload.key] = { ...actual, status: action.payload.status, page: 1 };
    },
    setOrdersStaffFilters: (
      state,
      action: PayloadAction<{ key: string; filters: StaffOrderFilters }>,
    ) => {
      const actual = state[action.payload.key] ?? EMPTY_ORDERS_LIST;
      state[action.payload.key] = { ...actual, staffFilters: action.payload.filters, page: 1 };
    },
    setOrdersPage: (state, action: PayloadAction<{ key: string; page: number }>) => {
      const actual = state[action.payload.key] ?? EMPTY_ORDERS_LIST;
      state[action.payload.key] = { ...actual, page: action.payload.page };
    },
  },
});

export const { setOrdersStatus, setOrdersStaffFilters, setOrdersPage } =
  ordersListSlice.actions;
export default ordersListSlice.reducer;
