import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { env } from '@/shared/config/env';
import { tokenStorage } from '@/shared/lib/tokenStorage';

/* Cliente unico contra el backend de Suminia. Cada feature inyecta sus
   endpoints con injectEndpoints en lugar de crear su propia api, de modo que
   todo comparte cache, middleware y cabeceras. */
export const baseApi = createApi({
  reducerPath: 'suminiaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: env.apiUrl,
    prepareHeaders: (headers) => {
      const token = tokenStorage.getAccessToken();
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  /* Al volver a una pantalla, si lo que hay en cache tiene mas de 30
     segundos se pide de nuevo. Sin esto, entrar a un pedido desde un aviso o
     desde otra pestaña enseñaba lo que habia la ultima vez. */
  refetchOnMountOrArgChange: 30,
  tagTypes: [
    'Auth',
    'Profile',
    'User',
    'Product',
    'Supplier',
    'Buyer',
    'DeliveryLocation',
    'Cart',
    'Order',
    'Notification',
    'Quote',
    'Finance',
    'Payout',
  ],
  endpoints: () => ({}),
});
