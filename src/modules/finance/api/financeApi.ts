import { baseApi } from '@/shared/api/baseApi';
import type {
  ApiResponse,
  PaginatedResponse,
  SignedUrl,
  UploadTicket,
} from '@/shared/api/types';

import type {
  CreditPortfolioRow,
  FinanceChange,
  FinanceSummary,
  MarkPayoutPaidRequest,
  OrganizationFinance,
  PayableSupplier,
  Payout,
  PayoutFileKind,
  PlatformSettings,
  PlatformSettingsUpdate,
} from '../model/finance.types';

/* El dinero de la plataforma. Lo que cambia una liquidacion o una regla
   cambia tambien el tablero: por eso casi todo invalida SUMMARY. */
const RESUMEN = { type: 'Finance' as const, id: 'SUMMARY' };

export const financeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFinanceSettings: builder.query<ApiResponse<PlatformSettings>, void>({
      query: () => '/finance/settings',
      providesTags: [{ type: 'Finance', id: 'SETTINGS' }],
    }),

    updateFinanceSettings: builder.mutation<ApiResponse<PlatformSettings>, PlatformSettingsUpdate>(
      {
        query: (body) => ({ url: '/finance/settings', method: 'PATCH', body }),
        invalidatesTags: [{ type: 'Finance', id: 'SETTINGS' }, { type: 'Finance', id: 'CHANGES' }, RESUMEN],
      },
    ),

    getFinanceChanges: builder.query<ApiResponse<FinanceChange[]>, void>({
      query: () => '/finance/changes',
      providesTags: [{ type: 'Finance', id: 'CHANGES' }],
    }),

    getFinanceSummary: builder.query<ApiResponse<FinanceSummary>, void>({
      query: () => '/finance/summary',
      providesTags: [RESUMEN],
    }),

    getCreditPortfolio: builder.query<ApiResponse<CreditPortfolioRow[]>, void>({
      query: () => '/finance/credit',
      providesTags: [{ type: 'Finance', id: 'CREDIT' }],
    }),

    getOrganizationFinance: builder.query<ApiResponse<OrganizationFinance>, string>({
      query: (id) => `/finance/organizations/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Finance', id: `ORG-${id}` }],
    }),

    updateSupplierCommission: builder.mutation<
      ApiResponse<OrganizationFinance>,
      { id: string; rate: number | null }
    >({
      query: ({ id, rate }) => ({
        url: `/finance/suppliers/${id}/commission`,
        method: 'PATCH',
        body: { rate },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Finance', id: `ORG-${id}` }],
    }),

    updateBuyerCredit: builder.mutation<
      ApiResponse<OrganizationFinance>,
      { id: string; enabled: boolean; limit: number | null; days: number | null }
    >({
      query: ({ id, ...body }) => ({
        url: `/finance/buyers/${id}/credit`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Finance', id: `ORG-${id}` },
        { type: 'Finance', id: 'CREDIT' },
        RESUMEN,
      ],
    }),

    getPayable: builder.query<ApiResponse<PayableSupplier[]>, void>({
      query: () => '/payouts/payable',
      providesTags: [{ type: 'Payout', id: 'PAYABLE' }],
    }),

    createPayout: builder.mutation<ApiResponse<Payout>, string>({
      query: (supplierOrganizationId) => ({
        url: '/payouts',
        method: 'POST',
        body: { supplierOrganizationId },
      }),
      invalidatesTags: [
        { type: 'Payout', id: 'PAYABLE' },
        { type: 'Payout', id: 'LIST' },
        /* Todos los pedidos, no solo la lista: una liquidacion cambia varios a
           la vez, y la ficha de cada uno enseña su liquidacion. */
        'Order',
        RESUMEN,
      ],
    }),

    getPayouts: builder.query<
      PaginatedResponse<Payout>,
      { page: number; limit: number; status?: 'PENDING' | 'PAID' }
    >({
      query: (params) => ({ url: '/payouts', params }),
      providesTags: [{ type: 'Payout', id: 'LIST' }],
    }),

    getPayout: builder.query<ApiResponse<Payout>, string>({
      query: (id) => `/payouts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Payout', id }],
    }),

    requestPayoutUpload: builder.mutation<
      ApiResponse<UploadTicket>,
      { id: string; kind: PayoutFileKind; contentType: string }
    >({
      query: ({ id, ...body }) => ({ url: `/payouts/${id}/uploads`, method: 'POST', body }),
    }),

    markPayoutPaid: builder.mutation<ApiResponse<Payout>, MarkPayoutPaidRequest>({
      query: ({ id, ...body }) => ({ url: `/payouts/${id}/pay`, method: 'POST', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Payout', id },
        { type: 'Payout', id: 'LIST' },
        /* Todos los pedidos, no solo la lista: una liquidacion cambia varios a
           la vez, y la ficha de cada uno enseña su liquidacion. */
        'Order',
        RESUMEN,
      ],
    }),

    getPayoutFileUrl: builder.mutation<ApiResponse<SignedUrl>, { id: string; key: string }>({
      query: ({ id, key }) => ({ url: `/payouts/${id}/file`, params: { key } }),
    }),
  }),
});

export const {
  useGetFinanceSettingsQuery,
  useUpdateFinanceSettingsMutation,
  useGetFinanceChangesQuery,
  useGetFinanceSummaryQuery,
  useGetCreditPortfolioQuery,
  useGetOrganizationFinanceQuery,
  useUpdateSupplierCommissionMutation,
  useUpdateBuyerCreditMutation,
  useGetPayableQuery,
  useCreatePayoutMutation,
  useGetPayoutsQuery,
  useGetPayoutQuery,
  useRequestPayoutUploadMutation,
  useMarkPayoutPaidMutation,
  useGetPayoutFileUrlMutation,
} = financeApi;
