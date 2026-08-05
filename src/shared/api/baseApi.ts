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
  tagTypes: ['Auth', 'Profile', 'Product', 'Supplier', 'Order'],
  endpoints: () => ({}),
});
