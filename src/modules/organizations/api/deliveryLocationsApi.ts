import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse, SignedUrl, UploadTicket } from '@/shared/api/types';

import type {
  DeliveryLocation,
  DeliveryLocationInput,
  LocationDocumentType,
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

    /* Los soportes de cada sede: permiso, subida directa a S3, confirmacion y
       enlace para abrirlos. */
    createLocationDocumentUploadUrl: builder.mutation<
      ApiResponse<UploadTicket>,
      { locationId: string; contentType: string }
    >({
      query: ({ locationId, contentType }) => ({
        url: `/delivery-locations/${locationId}/documents/upload-url`,
        method: 'POST',
        body: { contentType },
      }),
    }),

    confirmLocationDocument: builder.mutation<
      ApiResponse<DeliveryLocation>,
      {
        locationId: string;
        data: { type: LocationDocumentType; storageKey: string; filename?: string };
      }
    >({
      query: ({ locationId, data }) => ({
        url: `/delivery-locations/${locationId}/documents`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'DeliveryLocation', id: 'LIST' }],
    }),

    getLocationDocumentUrl: builder.mutation<
      ApiResponse<SignedUrl>,
      { locationId: string; documentId: string }
    >({
      query: ({ locationId, documentId }) => ({
        url: `/delivery-locations/${locationId}/documents/${documentId}/url`,
        method: 'GET',
      }),
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
  useCreateLocationDocumentUploadUrlMutation,
  useConfirmLocationDocumentMutation,
  useGetLocationDocumentUrlMutation,
} = deliveryLocationsApi;
