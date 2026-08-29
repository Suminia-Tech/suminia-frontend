/* API publica del modulo. Nada fuera de modules/products debe importar rutas
   internas (../model, ../api, ../ui): solo lo que se exporta aqui. */

export { MyProductsScreen } from './ui/supplier/MyProductsScreen';

export {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from './api/productsApi';

export type {
  Product,
  ProductCategory,
  ProductImage,
  ProductPresentation,
  ProductStatus,
  ProductType,
} from './model/product.types';
