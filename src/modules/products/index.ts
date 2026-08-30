/* API publica del modulo. Nada fuera de modules/products debe importar rutas
   internas (../model, ../api, ../ui): solo lo que se exporta aqui. */

/* Una pantalla por lado del marketplace. No comparten componente: el proveedor
   administra su catalogo y el comprador lo navega, que son dos trabajos
   distintos aunque lean el mismo endpoint. */
export { MyProductsScreen } from './ui/supplier/MyProductsScreen';
export { CatalogScreen } from './ui/buyer/CatalogScreen';

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
