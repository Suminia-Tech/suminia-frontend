import { baseApi } from '@/shared/api/baseApi';
import { toDatatableQuery } from '@/shared/api/datatable';
import type {
  ApiResponse,
  DatatableParams,
  PaginatedResponse,
} from '@/shared/api/types';

import type {
  ConfirmImageRequest,
  CreateProductRequest,
  PresentationRequest,
  Product,
  ProductCategory,
  UpdateImageRequest,
  UpdatePresentationRequest,
  UpdateProductRequest,
  UploadTicket,
} from '../model/product.types';

/* El mismo endpoint sirve dos lecturas del catalogo: el backend decide segun
   quien pregunta. Un proveedor recibe el suyo completo, con borradores; los
   demas solo lo publicado por empresas habilitadas. Aqui no hay que hacer nada
   distinto para cada caso. */
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, DatatableParams | void>({
      query: (params) => ({ url: '/products', params: toDatatableQuery(params ?? {}) }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product' as const, id: 'LIST' },
            ]
          : [{ type: 'Product' as const, id: 'LIST' }],
    }),

    getProduct: builder.query<ApiResponse<Product>, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),

    /* Las categorias son el vocabulario del marketplace y no cambian mientras
       alguien trabaja, de modo que no hace falta invalidarlas nunca. */
    getCategories: builder.query<ApiResponse<ProductCategory[]>, void>({
      query: () => '/products/categories',
    }),

    createProduct: builder.mutation<ApiResponse<Product>, CreateProductRequest>({
      query: (data) => ({ url: '/products', method: 'POST', body: data }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { id: string; data: UpdateProductRequest }
    >({
      query: ({ id, data }) => ({ url: `/products/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    deleteProduct: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    /* Los formatos cuelgan de su producto en la ruta, nunca sueltos: es lo que
       hace que la comprobacion de propiedad pase siempre por el producto. Todas
       estas mutaciones devuelven el producto entero ya actualizado. */
    addPresentation: builder.mutation<
      ApiResponse<Product>,
      { productId: string; data: PresentationRequest }
    >({
      query: ({ productId, data }) => ({
        url: `/products/${productId}/presentations`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    updatePresentation: builder.mutation<
      ApiResponse<Product>,
      { productId: string; presentationId: string; data: UpdatePresentationRequest }
    >({
      query: ({ productId, presentationId, data }) => ({
        url: `/products/${productId}/presentations/${presentationId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    removePresentation: builder.mutation<
      ApiResponse<Product>,
      { productId: string; presentationId: string }
    >({
      query: ({ productId, presentationId }) => ({
        url: `/products/${productId}/presentations/${presentationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    /* Imagenes: el backend firma el permiso y confirma, pero los bytes no pasan
       por el. El paso intermedio contra S3 lo hace useImageUpload, no RTK
       Query, porque no va contra nuestra API. */
    createImageUploadUrl: builder.mutation<
      ApiResponse<UploadTicket>,
      { productId: string; contentType: string }
    >({
      query: ({ productId, contentType }) => ({
        url: `/products/${productId}/images/upload-url`,
        method: 'POST',
        body: { contentType },
      }),
    }),

    confirmImage: builder.mutation<
      ApiResponse<Product>,
      { productId: string; data: ConfirmImageRequest }
    >({
      query: ({ productId, data }) => ({
        url: `/products/${productId}/images`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    updateImage: builder.mutation<
      ApiResponse<Product>,
      { productId: string; imageId: string; data: UpdateImageRequest }
    >({
      query: ({ productId, imageId, data }) => ({
        url: `/products/${productId}/images/${imageId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    removeImage: builder.mutation<
      ApiResponse<Product>,
      { productId: string; imageId: string }
    >({
      query: ({ productId, imageId }) => ({
        url: `/products/${productId}/images/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddPresentationMutation,
  useUpdatePresentationMutation,
  useRemovePresentationMutation,
  useCreateImageUploadUrlMutation,
  useConfirmImageMutation,
  useUpdateImageMutation,
  useRemoveImageMutation,
} = productsApi;
