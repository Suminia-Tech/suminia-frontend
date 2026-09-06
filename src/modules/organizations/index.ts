/* API publica del modulo. Nada fuera de modules/organizations debe importar
   rutas internas (../model, ../api, ../ui): solo lo que se exporta aqui. */

export { SuppliersScreen } from './ui/supplier/SuppliersScreen';
export { MyCompanyScreen } from './ui/supplier/MyCompanyScreen';
export { SupplierSummaryScreen } from './ui/supplier/SupplierSummaryScreen';
export { SupplierDetailScreen } from './ui/supplier/SupplierDetailScreen';

export { default as organizationsReducer } from './model/organizationsSlice';

export {
  useGetSuppliersQuery,
  useGetSupplierQuery,
  useUpdateSupplierMutation,
  useApproveSupplierMutation,
  useDeleteSupplierMutation,
} from './api/suppliersApi';

export type {
  Organization,
  OrganizationStatus,
  OrganizationType,
} from './model/organization.types';
export type { Supplier, UpdateSupplierRequest } from './model/supplier.types';
