import { baseApi } from '@/shared/api/baseApi';
import { toDatatableQuery } from '@/shared/api/datatable';
import type {
  ApiResponse,
  DatatableParams,
  PaginatedResponse,
} from '@/shared/api/types';

import type {
  CatalogMedicineDetail,
  CatalogMedicineSearchResult,
  ConfirmImageRequest,
  CreateCategoryRequest,
  CreateProductRequest,
  MedicineOffer,
  PresentationRequest,
  Product,
  ProductCategory,
  UpdateCategoryRequest,
  UpdateImageRequest,
  UpdatePresentationRequest,
  UpdateProductRequest,
  UploadTicket,
} from '../model/product.types';

/* El mismo endpoint sirve dos lecturas del catalogo: el backend decide segun
   quien pregunta. Un proveedor recibe el suyo completo, con borradores; los
   demas solo lo publicado por empresas habilitadas. Aqui no hay que hacer nada
   distinto para cada caso. */
/* El catalogo publico no entiende el filtro generico.

   Los endpoints de dentro reciben `filter[campo]=valor`, que es lo que arma
   `toDatatableQuery` y lo que espera el FilterValidationPipe. El controlador
   publico no lo usa a proposito: acepta la categoria como parametro suelto para
   no abrir al mundo un filtro que acepta varios campos. Es una decision del
   backend, y razonable; lo que faltaba era que el cliente la respetara.

   Sin esto, `/catalog` mandaba `filter[categoryId]`, el controlador lo ignoraba
   y devolvia el catalogo entero: elegir una categoria sin haber entrado no
   filtraba nada, y se leia como que el selector estaba roto. */
const toPublicQuery = (params: DatatableParams) => {
  const { filter, ...resto } = params;
  const { categoryId, ...otros } = filter ?? {};

  return {
    ...toDatatableQuery({ ...resto, filter: otros }),
    ...(categoryId ? { categoryId: String(categoryId) } : {}),
  };
};

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
    /* El maestro del INVIMA. No lleva tags de cache invalidables porque no lo
       escribe nadie desde la aplicacion: lo sincroniza un script contra el
       dataset oficial, de modo que dentro de una sesion no cambia. */
    searchCatalogMedicines: builder.query<
      ApiResponse<CatalogMedicineSearchResult[]>,
      string
    >({
      query: (search) => ({
        url: '/products/catalog/medicines',
        params: { search },
      }),
    }),

    /* Las presentaciones van aparte del buscador porque son decenas por
       medicamento: se piden cuando ya se eligio uno. */
    getCatalogMedicine: builder.query<ApiResponse<CatalogMedicineDetail>, string>({
      query: (id) => `/products/catalog/medicines/${id}`,
    }),

    /* Quien mas vende este mismo medicamento. Es la consulta por la que existe
       el maestro: sin ella el comprador no puede comparar. */
    getMedicineOffers: builder.query<ApiResponse<MedicineOffer[]>, string>({
      query: (productId) => `/products/${productId}/offers`,
      providesTags: (_result, _error, productId) => [
        { type: 'Product' as const, id: productId },
      ],
    }),

/* El catalogo que se ve sin haber entrado. Va contra /public/products, que
       en el backend es un controlador propio y sin guardas: lo que Suminia
       publica al mundo es una lista corta y explicita, no lo que quede de
       aflojar las guardas de los endpoints de dentro.

       Estas respuestas nunca traen precios. No es que la pantalla los tape: no
       vienen. */
    getPublicProducts: builder.query<PaginatedResponse<Product>, DatatableParams | void>({
      query: (params) => ({
        url: '/public/products',
        params: toPublicQuery(params ?? {}),
      }),
    }),

    getPublicProduct: builder.query<ApiResponse<Product>, string>({
      query: (id) => `/public/products/${id}`,
    }),

    getPublicCategories: builder.query<ApiResponse<ProductCategory[]>, void>({
      query: () => '/public/products/categories',
    }),

    createCategory: builder.mutation<
      ApiResponse<ProductCategory>,
      CreateCategoryRequest
    >({
      query: (data) => ({
        url: '/products/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Product', id: 'CATEGORIES' }],
    }),

    updateCategory: builder.mutation<
      ApiResponse<ProductCategory>,
      { id: string; data: UpdateCategoryRequest }
    >({
      query: ({ id, data }) => ({
        url: `/products/categories/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [{ type: 'Product', id: 'CATEGORIES' }],
    }),

    deleteCategory: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/products/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Product', id: 'CATEGORIES' }],
    }),

    getCategories: builder.query<ApiResponse<ProductCategory[]>, void>({
      query: () => '/products/categories',
      providesTags: [{ type: 'Product', id: 'CATEGORIES' }],
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
  useGetPublicProductsQuery,
  useGetPublicProductQuery,
  useGetPublicCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useSearchCatalogMedicinesQuery,
  useLazySearchCatalogMedicinesQuery,
  useGetCatalogMedicineQuery,
  useGetMedicineOffersQuery,
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
