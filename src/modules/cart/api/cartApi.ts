import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse } from '@/shared/api/types';

import type {
  AddCartItemRequest,
  Cart,
  UpdateCartItemRequest,
} from '../model/cart.types';

/* Las cinco operaciones del carrito.

   Todas devuelven el carrito entero, de modo que no hace falta un slice que lo
   guarde aparte: la respuesta de cada mutacion refresca la cache y la cabecera
   y la pagina del carrito leen lo mismo. Una segunda copia en el cliente solo
   podria desincronizarse, y desincronizada enseña un total que no es el que se
   va a cobrar. */
export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<ApiResponse<Cart>, void>({
      query: () => '/cart',
      providesTags: [{ type: 'Cart', id: 'MINE' }],
    }),

    addCartItem: builder.mutation<ApiResponse<Cart>, AddCartItemRequest>({
      query: (body) => ({ url: '/cart/items', method: 'POST', body }),
      invalidatesTags: [{ type: 'Cart', id: 'MINE' }],
    }),

    updateCartItem: builder.mutation<ApiResponse<Cart>, UpdateCartItemRequest>({
      query: ({ id, quantity }) => ({
        url: `/cart/items/${id}`,
        method: 'PATCH',
        body: { quantity },
      }),
      invalidatesTags: [{ type: 'Cart', id: 'MINE' }],
    }),

    removeCartItem: builder.mutation<ApiResponse<Cart>, string>({
      query: (id) => ({ url: `/cart/items/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Cart', id: 'MINE' }],
    }),

    clearCart: builder.mutation<ApiResponse<Cart>, void>({
      query: () => ({ url: '/cart', method: 'DELETE' }),
      invalidatesTags: [{ type: 'Cart', id: 'MINE' }],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
