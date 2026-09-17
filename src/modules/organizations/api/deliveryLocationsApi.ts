import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse } from '@/shared/api/types';

import type {
  DeliveryLocation,
  DeliveryLocationInput,
  UpdateDeliveryLocationRequest,
} from '../model/deliveryLocation.types';

export const deliveryLocationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveryLocations: builder.query<ApiResponse<DeliveryLocation[]>, void>({
      query: () => '/delivery-locations',
      providesTags: [{ type: 'DeliveryLocation', id: 'LIST' }],
    }),

    createDeliveryLocation: builder.mutation<
      ApiResponse<DeliveryLocation>,
      DeliveryLocationInput
    >({
      query: (body) => ({ url: '/delivery-locations', method: 'POST', body }),
      invalidatesTags: [{ type: 'DeliveryLocation', id: 'LIST' }],
    }),

    updateDeliveryLocation: builder.mutation<
      ApiResponse<DeliveryLocation>,
      UpdateDeliveryLocationRequest
    >({
      query: ({ id, data }) => ({
        url: `/delivery-locations/${id}`,
        method: 'PATCH',
        body: data,
      }),
      /* Se invalida la lista entera y no solo la sede tocada: marcar una como
         predeterminada se la quita a otra, de modo que cambian dos filas. */
      invalidatesTags: [{ type: 'DeliveryLocation', id: 'LIST' }],
    }),

    deleteDeliveryLocation: builder.mutation<ApiResponse<{ id: string }>, string>({
      query: (id) => ({ url: `/delivery-locations/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'DeliveryLocation', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetDeliveryLocationsQuery,
  useCreateDeliveryLocationMutation,
  useUpdateDeliveryLocationMutation,
  useDeleteDeliveryLocationMutation,
} = deliveryLocationsApi;
