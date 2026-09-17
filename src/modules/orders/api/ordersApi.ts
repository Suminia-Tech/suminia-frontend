import { baseApi } from '@/shared/api/baseApi';
import { toDatatableQuery } from '@/shared/api/datatable';
import type {
  ApiResponse,
  DatatableParams,
  PaginatedResponse,
} from '@/shared/api/types';

import type {
  ChangeOrderStatusRequest,
  Order,
  PlaceOrdersRequest,
} from '../model/order.types';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* Devuelve varios: un carrito con tres proveedores sale en tres pedidos. */
    placeOrders: builder.mutation<ApiResponse<Order[]>, PlaceOrdersRequest>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      /* Tambien el carrito: el backend lo vacia al confirmar, de modo que la
         cabecera tiene que dejar de enseñar lo que ya se pidio. */
      invalidatesTags: [
        { type: 'Order', id: 'LIST' },
        { type: 'Cart', id: 'MINE' },
        /* Y los productos: el pedido aparta inventario. */
        { type: 'Product', id: 'LIST' },
      ],
    }),

    getOrders: builder.query<PaginatedResponse<Order>, DatatableParams | void>({
      query: (params) => ({ url: '/orders', params: toDatatableQuery(params ?? {}) }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order' as const, id: 'LIST' },
            ]
          : [{ type: 'Order' as const, id: 'LIST' }],
    }),

    getOrder: builder.query<ApiResponse<Order>, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),

    changeOrderStatus: builder.mutation<
      ApiResponse<Order>,
      ChangeOrderStatusRequest
    >({
      query: ({ id, status, reason }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status, ...(reason ? { reason } : {}) },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        /* Anular o rechazar repone el inventario. */
        { type: 'Product', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  usePlaceOrdersMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useChangeOrderStatusMutation,
} = ordersApi;
