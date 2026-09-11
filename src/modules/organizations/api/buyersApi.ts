import { baseApi } from '@/shared/api/baseApi';
import { toDatatableQuery } from '@/shared/api/datatable';
import type {
  ApiResponse,
  DatatableParams,
  PaginatedResponse,
} from '@/shared/api/types';

import type { Buyer, UpdateBuyerRequest } from '../model/buyer.types';

export const buyersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBuyers: builder.query<PaginatedResponse<Buyer>, DatatableParams | void>({
      query: (params) => ({ url: '/buyers', params: toDatatableQuery(params ?? {}) }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: 'Buyer' as const, id })),
              { type: 'Buyer' as const, id: 'LIST' },
            ]
          : [{ type: 'Buyer' as const, id: 'LIST' }],
    }),

    getBuyer: builder.query<ApiResponse<Buyer>, string>({
      query: (id) => `/buyers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Buyer', id }],
    }),

    updateBuyer: builder.mutation<
      ApiResponse<Buyer>,
      { id: string; data: UpdateBuyerRequest }
    >({
      query: ({ id, data }) => ({ url: `/buyers/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Buyer', id },
        { type: 'Buyer', id: 'LIST' },
      ],
    }),

    /* Aprobar pasa la organizacion de PENDING a ACTIVE, que es lo que la
       habilita a operar. Invalida la lista porque el estado se muestra ahi. */
    approveBuyer: builder.mutation<ApiResponse<Buyer>, string>({
      query: (id) => ({ url: `/buyers/${id}/approve`, method: 'PATCH' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Buyer', id },
        { type: 'Buyer', id: 'LIST' },
      ],
    }),

    /* Rechazar, suspender y reactivar son la misma decision del personal
       interno sobre si una empresa puede operar, y el backend valida que la
       transicion tenga sentido desde el estado actual. */
    rejectBuyer: builder.mutation<ApiResponse<Buyer>, string>({
      query: (id) => ({ url: `/buyers/${id}/reject`, method: 'PATCH' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Buyer', id },
        { type: 'Buyer', id: 'LIST' },
      ],
    }),

    suspendBuyer: builder.mutation<ApiResponse<Buyer>, string>({
      query: (id) => ({ url: `/buyers/${id}/suspend`, method: 'PATCH' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Buyer', id },
        { type: 'Buyer', id: 'LIST' },
      ],
    }),

    reactivateBuyer: builder.mutation<ApiResponse<Buyer>, string>({
      query: (id) => ({ url: `/buyers/${id}/reactivate`, method: 'PATCH' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Buyer', id },
        { type: 'Buyer', id: 'LIST' },
      ],
    }),

    deleteBuyer: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/buyers/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Buyer', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetBuyersQuery,
  useGetBuyerQuery,
  useUpdateBuyerMutation,
  useApproveBuyerMutation,
  useRejectBuyerMutation,
  useSuspendBuyerMutation,
  useReactivateBuyerMutation,
  useDeleteBuyerMutation,
} = buyersApi;
