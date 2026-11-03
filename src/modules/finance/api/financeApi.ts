import { baseApi } from '@/shared/api/baseApi';
import type {
  ApiResponse,
  PaginatedResponse,
  SignedUrl,
  UploadTicket,
} from '@/shared/api/types';

import type {
  CommercialLine,
  CommercialLineSetting,
  CreditPortfolioRow,
  FinanceChange,
  FinanceDashboard,
  FinanceSummary,
  MarkPayoutPaidRequest,
  OrganizationFinance,
  PayableSupplier,
  Payout,
  PayoutFileKind,
  PlanMonth,
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
        /* El incremento general entra en el precio del catalogo, y los
           supuestos del plan en el tablero. */
        invalidatesTags: [
          { type: 'Finance', id: 'SETTINGS' },
          { type: 'Finance', id: 'CHANGES' },
          { type: 'Finance', id: 'DASHBOARD' },
          { type: 'Product', id: 'LIST' },
          { type: 'Cart', id: 'MINE' },
          RESUMEN,
        ],
      },
    ),

    /* El tablero 360 del año: lo real contra el plan. */
    getFinanceDashboard: builder.query<ApiResponse<FinanceDashboard>, number | void>({
      query: (year) => ({ url: '/finance/dashboard', params: year ? { year } : {} }),
      providesTags: [{ type: 'Finance', id: 'DASHBOARD' }, RESUMEN],
    }),

    getCommercialLines: builder.query<ApiResponse<CommercialLineSetting[]>, void>({
      query: () => '/finance/commercial-lines',
      providesTags: [{ type: 'Finance', id: 'LINES' }],
    }),

    updateCommercialLine: builder.mutation<
      ApiResponse<CommercialLineSetting[]>,
      { line: CommercialLine } & Partial<
        Pick<CommercialLineSetting, 'markupRate' | 'minRate' | 'maxRate' | 'planMixRate'>
      >
    >({
      query: ({ line, ...body }) => ({
        url: `/finance/commercial-lines/${line}`,
        method: 'PATCH',
        body,
      }),
      /* El incremento entra en el precio de todo el catalogo. */
      invalidatesTags: [
        { type: 'Finance', id: 'LINES' },
        { type: 'Finance', id: 'CHANGES' },
        { type: 'Finance', id: 'DASHBOARD' },
        { type: 'Product', id: 'LIST' },
        { type: 'Cart', id: 'MINE' },
      ],
    }),

    assignCategoryLine: builder.mutation<
      ApiResponse<CommercialLineSetting[]>,
      { categoryId: string; line: CommercialLine }
    >({
      query: ({ categoryId, line }) => ({
        url: `/finance/categories/${categoryId}/line`,
        method: 'PATCH',
        body: { line },
      }),
      invalidatesTags: [
        { type: 'Finance', id: 'LINES' },
        { type: 'Finance', id: 'CHANGES' },
        { type: 'Product', id: 'LIST' },
        { type: 'Cart', id: 'MINE' },
      ],
    }),

    getPlan: builder.query<ApiResponse<PlanMonth[]>, void>({
      query: () => '/finance/plan',
      providesTags: [{ type: 'Finance', id: 'PLAN' }],
    }),

    savePlanMonth: builder.mutation<ApiResponse<PlanMonth[]>, PlanMonth>({
      query: ({ month, ...body }) => ({ url: `/finance/plan/${month}`, method: 'PUT', body }),
      invalidatesTags: [
        { type: 'Finance', id: 'PLAN' },
        { type: 'Finance', id: 'CHANGES' },
        { type: 'Finance', id: 'DASHBOARD' },
      ],
    }),

    /* Los proveedores con comision pactada: no cambian con la general. */
    getNegotiatedCommissions: builder.query<
      ApiResponse<{ id: string; name: string; rate: number }[]>,
      void
    >({
      query: () => '/finance/negotiated-commissions',
      providesTags: [{ type: 'Finance', id: 'NEGOTIATED' }],
    }),

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
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Finance', id: `ORG-${id}` },
        { type: 'Finance', id: 'NEGOTIATED' },
      ],
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
  useGetFinanceDashboardQuery,
  useGetCommercialLinesQuery,
  useUpdateCommercialLineMutation,
  useAssignCategoryLineMutation,
  useGetPlanQuery,
  useSavePlanMonthMutation,
  useGetNegotiatedCommissionsQuery,
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
