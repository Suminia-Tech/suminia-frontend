/* API publica del modulo. Nada fuera de modules/products debe importar rutas
   internas (../model, ../api, ../ui): solo lo que se exporta aqui. */

/* Una pantalla por lado del marketplace. No comparten componente: el proveedor
   administra su catalogo y el comprador lo navega, que son dos trabajos
   distintos aunque lean el mismo endpoint. */
export { MyProductsScreen } from './ui/supplier/MyProductsScreen';
export { CategoriesScreen } from './ui/admin/CategoriesScreen';

/* Las publicas se sirven desde (suminia)/: mismo modulo, otra lectura. Lo que
   cambia no es la pantalla, es que la respuesta no trae precios. */
export { PublicCatalogScreen } from './ui/public/PublicCatalogScreen';
export { PublicProductScreen } from './ui/public/PublicProductScreen';
export { FeaturedProducts } from './ui/public/FeaturedProducts';
export { CategoryGrid } from './ui/public/CategoryGrid';

export {
  useGetPublicCategoriesQuery,
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
