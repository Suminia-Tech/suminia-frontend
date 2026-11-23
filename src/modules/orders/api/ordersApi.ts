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
  AcceptAvailabilityRequest,
  AttachInvoiceRequest,
  ChangeOrderStatusRequest,
  ClaimReason,
  ConvertQuoteRequest,
  CreditStatus,
  MonthlyBilling,
  Order,
  OrderPreview,
  OrderFileKind,
  OrderMetrics,
  PaymentInstructions,
  PlaceOrdersRequest,
  ProposeAvailabilityRequest,
  Quote,
  QuoteSummary,
  RecordRefundRequest,
  ReviewPaymentRequest,
  SubmitPaymentRequest,
} from '../model/order.types';

/* Lo que cambia cuando se mueve el dinero de un pedido: el pedido, la lista y
   las cifras de finanzas. */
const dineroDe = (id: string) => [
  { type: 'Order' as const, id },
  { type: 'Order' as const, id: 'LIST' },
  { type: 'Finance' as const, id: 'SUMMARY' },
];

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
        /* Y el cupo, si fue a credito. */
        { type: 'Finance', id: 'MY_CREDIT' },
      ],
    }),

    /* Mes a mes, el mas reciente primero. Se agrupa en el backend: sumar
       aqui obligaba a traer todos los pedidos de la historia. */
    getBilling: builder.query<ApiResponse<MonthlyBilling[]>, void>({
      query: () => '/orders/billing',
      providesTags: [{ type: 'Order', id: 'LIST' }],
    }),

    /* Los mismos filter[...] del listado. */
    getOrderMetrics: builder.query<
      ApiResponse<OrderMetrics>,
      Record<string, string> | void
    >({
      query: (filter) => ({
        url: '/orders/metrics',
        params: toDatatableQuery({ filter: filter ?? {} }),
      }),
      providesTags: [{ type: 'Order', id: 'LIST' }],
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

    /* La vigencia minima del lote, para validar la fecha en el campo. Cambia
       rara vez: se guarda mientras dure la sesion. */
    getLotRules: builder.query<ApiResponse<{ minShelfLifeMonths: number }>, void>({
      query: () => '/orders/lot-rules',
      keepUnusedDataFor: 3600,
    }),

    /* Si una linea sale con lote y, si sale, cual y cuando vence. */
    setOrderItemLot: builder.mutation<
      ApiResponse<Order>,
      { id: string; itemId: string; hasLot: boolean; lotNumber?: string; expiresAt?: string }
    >({
      query: ({ id, itemId, hasLot, lotNumber, expiresAt }) => ({
        url: `/orders/${id}/items/${itemId}/lot`,
        method: 'PATCH',
        body: hasLot ? { hasLot, lotNumber, expiresAt } : { hasLot },
      }),
      /* La respuesta se ve en cuanto se marca, sin recargar el pedido: al
         invalidarlo, la tabla entera se volvia a pintar y parpadeaba en cada
         producto. Si el servidor la rechaza, se deshace. El lote no cambia ni
         la lista ni las finanzas, de modo que no hay nada mas que refrescar. */
      async onQueryStarted(
        { id, itemId, hasLot, lotNumber, expiresAt },
        { dispatch, queryFulfilled },
      ) {
        const parche = dispatch(
          ordersApi.util.updateQueryData('getOrder', id, (draft) => {
            const item = draft.data.items.find((linea) => linea.id === itemId);
            if (!item) return;
            item.hasLot = hasLot;
            item.lotNumber = hasLot ? (lotNumber ?? null) : null;
            item.expiresAt = hasLot ? (expiresAt ?? null) : null;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          parche.undo();
        }
      },
    }),

    changeOrderStatus: builder.mutation<
      ApiResponse<Order>,
      ChangeOrderStatusRequest
    >({
      query: ({
        id,
        status,
        reason,
        issue,
        estimatedDeliveryAt,
        carrierName,
        trackingNumber,
        delivery,
      }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: {
          status,
          ...(reason ? { reason } : {}),
          ...(issue ? { issue } : {}),
          ...(estimatedDeliveryAt ? { estimatedDeliveryAt } : {}),
          ...(carrierName ? { carrierName } : {}),
          ...(trackingNumber ? { trackingNumber } : {}),
          ...(delivery ? { delivery } : {}),
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        /* Cancelar o rechazar repone el inventario. */
        { type: 'Product', id: 'LIST' },
        /* Y mueve las cifras de finanzas: lo que espera pago, lo por liquidar. */
        { type: 'Finance', id: 'SUMMARY' },
      ],
    }),

    proposeAvailability: builder.mutation<ApiResponse<Order>, ProposeAvailabilityRequest>({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}/availability`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),

    /* Aceptar crea el pedido pendiente y devuelve al inventario lo que el
       comprador no se lleva: por eso tambien la lista y los productos. */
    acceptAvailability: builder.mutation<ApiResponse<Order>, AcceptAvailabilityRequest>({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}/availability/accept`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    /* Lo que costaria el carrito en una sede, con el envio de cada proveedor. */
    getOrderPreview: builder.query<ApiResponse<OrderPreview>, string>({
      query: (deliveryLocationId) => ({
        url: '/orders/preview',
        params: deliveryLocationId ? { deliveryLocationId } : {},
      }),
      providesTags: [{ type: 'Cart', id: 'MINE' }],
    }),

    /* El permiso para subir un archivo del pedido directo al almacenamiento. */
    requestOrderUpload: builder.mutation<
      ApiResponse<UploadTicket>,
      { id: string; kind: OrderFileKind; contentType: string }
    >({
      query: ({ id, ...body }) => ({ url: `/orders/${id}/uploads`, method: 'POST', body }),
    }),

    submitPayment: builder.mutation<ApiResponse<Order>, SubmitPaymentRequest>({
      query: ({ id, ...body }) => ({ url: `/orders/${id}/payments`, method: 'POST', body }),
      invalidatesTags: (_result, _error, { id }) => dineroDe(id),
    }),

    reviewPayment: builder.mutation<ApiResponse<Order>, ReviewPaymentRequest>({
      query: ({ id, paymentId, ...body }) => ({
        url: `/orders/${id}/payments/${paymentId}/review`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => dineroDe(id),
    }),

    attachInvoice: builder.mutation<ApiResponse<Order>, AttachInvoiceRequest>({
      query: ({ id, ...body }) => ({ url: `/orders/${id}/invoice`, method: 'POST', body }),
      invalidatesTags: (_result, _error, { id }) => dineroDe(id),
    }),

    /* La factura de Suminia al comprador: la adjunta el personal de Suminia. */
    attachSuminiaInvoice: builder.mutation<ApiResponse<Order>, AttachInvoiceRequest>({
      query: ({ id, ...body }) => ({ url: `/orders/${id}/suminia-invoice`, method: 'POST', body }),
      invalidatesTags: (_result, _error, { id }) => dineroDe(id),
    }),

    openClaim: builder.mutation<
      ApiResponse<Order>,
      { id: string; reason: ClaimReason; description: string }
    >({
      query: ({ id, ...body }) => ({ url: `/orders/${id}/claims`, method: 'POST', body }),
      invalidatesTags: (_result, _error, { id }) => dineroDe(id),
    }),

    /* Cerrar el pedido: el comprador confirma que llego bien, se acaban los
       dias de reclamo y entra en la siguiente liquidacion. */
    confirmReceipt: builder.mutation<ApiResponse<Order>, string>({
      query: (id) => ({ url: `/orders/${id}/receipt`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => dineroDe(id),
    }),

    resolveClaim: builder.mutation<
      ApiResponse<Order>,
      { id: string; claimId: string; resolution: string }
    >({
      query: ({ id, claimId, resolution }) => ({
        url: `/orders/${id}/claims/${claimId}/resolve`,
        method: 'POST',
        body: { resolution },
      }),
      invalidatesTags: (_result, _error, { id }) => dineroDe(id),
    }),

    addOrderNote: builder.mutation<ApiResponse<Order>, { id: string; body: string }>({
      query: ({ id, body }) => ({
        url: `/orders/${id}/notes`,
        method: 'POST',
        body: { body },
      }),
      invalidatesTags: (_result, _error, { id }) => dineroDe(id),
    }),

    recordRefund: builder.mutation<ApiResponse<Order>, RecordRefundRequest>({
      query: ({ id, ...body }) => ({ url: `/orders/${id}/refund`, method: 'POST', body }),
      invalidatesTags: (_result, _error, { id }) => dineroDe(id),
    }),

    /* El enlace firmado se pide al abrir, no al listar: caduca en minutos. */
    getOrderFileUrl: builder.mutation<ApiResponse<SignedUrl>, { id: string; key: string }>({
      query: ({ id, key }) => ({ url: `/orders/${id}/file`, params: { key } }),
    }),

    /* Vuelve a meter al carrito lo de un pedido. */
    reorder: builder.mutation<ApiResponse<{ added: number; skipped: number }>, string>({
      query: (id) => ({ url: `/orders/${id}/reorder`, method: 'POST' }),
      invalidatesTags: [{ type: 'Cart', id: 'MINE' }],
    }),

    /* La cuenta de Suminia y el plazo para pagar. Vive en /finance en el
       backend, pero solo la usan las pantallas de pedidos: traerla aqui evita
       que un modulo importe otro. */
    getPaymentInstructions: builder.query<ApiResponse<PaymentInstructions>, void>({
      query: () => '/finance/payment-instructions',
      providesTags: [{ type: 'Finance', id: 'SETTINGS' }],
    }),

    /* El credito de la propia empresa, para elegir como pagar. */
    getMyCredit: builder.query<ApiResponse<CreditStatus>, void>({
      query: () => '/finance/my-credit',
      providesTags: [{ type: 'Finance', id: 'MY_CREDIT' }],
    }),

    createQuote: builder.mutation<ApiResponse<Quote>, void>({
      query: () => ({ url: '/quotes', method: 'POST' }),
      /* El backend vacia el carrito al cotizar: lo cotizado vive ahora en la
         cotizacion, y de ella sale el pedido. */
      invalidatesTags: [
        { type: 'Quote', id: 'LIST' },
        { type: 'Cart', id: 'MINE' },
      ],
    }),

    getQuotes: builder.query<PaginatedResponse<QuoteSummary>, { page: number; limit: number }>({
      query: (params) => ({ url: '/quotes', params }),
      providesTags: [{ type: 'Quote', id: 'LIST' }],
    }),

    getQuote: builder.query<ApiResponse<Quote>, string>({
      query: (id) => `/quotes/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Quote', id }],
    }),

    /* El PDF llega como archivo y se entrega como URL de objeto: el Blob no
       se puede guardar en el store, y quien lo pide solo quiere descargarlo.
       Quien la recibe la libera con URL.revokeObjectURL. */
    downloadQuotePdf: builder.mutation<string, string>({
      query: (id) => ({
        url: `/quotes/${id}/pdf`,
        responseHandler: async (response) =>
          response.ok ? URL.createObjectURL(await response.blob()) : response.json(),
      }),
    }),

    /* La orden de compra en PDF, igual que la cotizacion: llega como URL de
       objeto para descargarla. */
    downloadPurchaseOrderPdf: builder.mutation<string, string>({
      query: (id) => ({
        url: `/orders/${id}/purchase-order/pdf`,
        responseHandler: async (response) =>
          response.ok ? URL.createObjectURL(await response.blob()) : response.json(),
      }),
    }),

    convertQuote: builder.mutation<ApiResponse<Order[]>, ConvertQuoteRequest>({
      query: ({ id, ...body }) => ({ url: `/quotes/${id}/convert`, method: 'POST', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Quote', id },
        { type: 'Quote', id: 'LIST' },
        { type: 'Order', id: 'LIST' },
        { type: 'Product', id: 'LIST' },
        { type: 'Finance', id: 'MY_CREDIT' },
      ],
    }),
  }),
});

export const {
  useGetBillingQuery,
  useGetOrderMetricsQuery,
  usePlaceOrdersMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useChangeOrderStatusMutation,
  useSetOrderItemLotMutation,
  useGetLotRulesQuery,
  useProposeAvailabilityMutation,
  useAcceptAvailabilityMutation,
  useRequestOrderUploadMutation,
  useSubmitPaymentMutation,
  useReviewPaymentMutation,
  useAttachInvoiceMutation,
  useAttachSuminiaInvoiceMutation,
  useOpenClaimMutation,
  useResolveClaimMutation,
  useAddOrderNoteMutation,
  useRecordRefundMutation,
  useGetOrderFileUrlMutation,
  useReorderMutation,
  useGetPaymentInstructionsQuery,
  useGetMyCreditQuery,
  useGetOrderPreviewQuery,
  useCreateQuoteMutation,
  useConfirmReceiptMutation,
  useGetQuotesQuery,
  useGetQuoteQuery,
  useDownloadQuotePdfMutation,
  useDownloadPurchaseOrderPdfMutation,
  useConvertQuoteMutation,
} = ordersApi;
