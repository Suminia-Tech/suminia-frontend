import { baseApi } from '@/shared/api/baseApi';
import { toDatatableQuery } from '@/shared/api/datatable';
import type {
  ApiResponse,
  DatatableParams,
  PaginatedResponse,
  SignedUrl,
  UploadTicket,
} from '@/shared/api/types';

import type {
  OrganizationStatusChange,
  StatusDecisionRequest,
} from '../model/organization.types';
import type {
  ConfirmSupplierDocumentRequest,
  ReviewDocumentRequest,
  SaveSupplierDeclarationRequest,
  Supplier,
  UpdateSupplierRequest,
} from '../model/supplier.types';

export const suppliersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query<PaginatedResponse<Supplier>, DatatableParams | void>({
      query: (params) => ({ url: '/suppliers', params: toDatatableQuery(params ?? {}) }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: 'Supplier' as const, id })),
              { type: 'Supplier' as const, id: 'LIST' },
            ]
          : [{ type: 'Supplier' as const, id: 'LIST' }],
    }),

    getSupplier: builder.query<ApiResponse<Supplier>, string>({
      query: (id) => `/suppliers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Supplier', id }],
    }),

    updateSupplier: builder.mutation<
      ApiResponse<Supplier>,
      { id: string; data: UpdateSupplierRequest }
    >({
      query: ({ id, data }) => ({ url: `/suppliers/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Supplier', id },
        { type: 'Supplier', id: 'LIST' },
      ],
    }),

    /* La constancia interna de las decisiones sobre la empresa. */
    getSupplierStatusHistory: builder.query<ApiResponse<OrganizationStatusChange[]>, string>({
      query: (id) => `/suppliers/${id}/status-history`,
      providesTags: (_result, _error, id) => [{ type: 'Supplier', id: `HISTORY-${id}` }],
    }),

    /* Aprobar pasa la organizacion de PENDING a ACTIVE, que es lo que la
       habilita a operar. Invalida la lista porque el estado se muestra ahi. */
    approveSupplier: builder.mutation<ApiResponse<Supplier>, StatusDecisionRequest>({
      query: ({ id, reason }) => ({
        url: `/suppliers/${id}/approve`,
        method: 'PATCH',
        body: { reason: reason?.trim() || undefined },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Supplier', id: `HISTORY-${id}` },
        { type: 'Supplier', id },
        { type: 'Supplier', id: 'LIST' },
      ],
    }),

    /* Rechazar, suspender y reactivar son la misma decision del personal
       interno sobre si una empresa puede operar, y el backend valida que la
       transicion tenga sentido desde el estado actual. */
    rejectSupplier: builder.mutation<ApiResponse<Supplier>, StatusDecisionRequest>({
      query: ({ id, reason }) => ({
        url: `/suppliers/${id}/reject`,
        method: 'PATCH',
        body: { reason: reason?.trim() || undefined },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Supplier', id: `HISTORY-${id}` },
        { type: 'Supplier', id },
        { type: 'Supplier', id: 'LIST' },
      ],
    }),

    suspendSupplier: builder.mutation<ApiResponse<Supplier>, StatusDecisionRequest>({
      query: ({ id, reason }) => ({
        url: `/suppliers/${id}/suspend`,
        method: 'PATCH',
        body: { reason: reason?.trim() || undefined },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Supplier', id: `HISTORY-${id}` },
        { type: 'Supplier', id },
        { type: 'Supplier', id: 'LIST' },
      ],
    }),

    reactivateSupplier: builder.mutation<ApiResponse<Supplier>, StatusDecisionRequest>({
      query: ({ id, reason }) => ({
        url: `/suppliers/${id}/reactivate`,
        method: 'PATCH',
        body: { reason: reason?.trim() || undefined },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Supplier', id: `HISTORY-${id}` },
        { type: 'Supplier', id },
        { type: 'Supplier', id: 'LIST' },
      ],
    }),

    saveSupplierDeclaration: builder.mutation<
      ApiResponse<Supplier>,
      { supplierId: string; data: SaveSupplierDeclarationRequest }
    >({
      query: ({ supplierId, data }) => ({
        url: `/suppliers/${supplierId}/declaration`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { supplierId }) => [
        { type: 'Supplier', id: supplierId },
      ],
    }),

    /* Los documentos legales: permiso, subida directa a S3 y confirmacion. */
    createSupplierDocumentUploadUrl: builder.mutation<
      ApiResponse<UploadTicket>,
      { supplierId: string; contentType: string }
    >({
      query: ({ supplierId, contentType }) => ({
        url: `/suppliers/${supplierId}/documents/upload-url`,
        method: 'POST',
        body: { contentType },
      }),
    }),

    confirmSupplierDocument: builder.mutation<
      ApiResponse<Supplier>,
      { supplierId: string; data: ConfirmSupplierDocumentRequest }
    >({
      query: ({ supplierId, data }) => ({
        url: `/suppliers/${supplierId}/documents`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { supplierId }) => [
        { type: 'Supplier', id: supplierId },
      ],
    }),

    /* Mutacion y no consulta: el enlace caduca, y cachearlo serviria uno
       vencido al segundo clic. */
    getSupplierDocumentUrl: builder.mutation<
      ApiResponse<SignedUrl>,
      { supplierId: string; documentId: string }
    >({
      query: ({ supplierId, documentId }) => ({
        url: `/suppliers/${supplierId}/documents/${documentId}/url`,
        method: 'GET',
      }),
    }),

    reviewSupplierDocument: builder.mutation<
      ApiResponse<Supplier>,
      { supplierId: string; documentId: string; data: ReviewDocumentRequest }
    >({
      query: ({ supplierId, documentId, data }) => ({
        url: `/suppliers/${supplierId}/documents/${documentId}/review`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { supplierId }) => [
        { type: 'Supplier', id: supplierId },
      ],
    }),

    deleteSupplier: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/suppliers/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Supplier', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetSupplierStatusHistoryQuery,
  useGetSuppliersQuery,
  useGetSupplierQuery,
  useUpdateSupplierMutation,
  useApproveSupplierMutation,
  useRejectSupplierMutation,
  useSuspendSupplierMutation,
  useReactivateSupplierMutation,
  useDeleteSupplierMutation,
  useCreateSupplierDocumentUploadUrlMutation,
  useConfirmSupplierDocumentMutation,
  useGetSupplierDocumentUrlMutation,
  useReviewSupplierDocumentMutation,
  useSaveSupplierDeclarationMutation,
} = suppliersApi;
