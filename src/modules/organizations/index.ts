/* API publica del modulo. Nada fuera de modules/organizations debe importar
   rutas internas (../model, ../api, ../ui): solo lo que se exporta aqui. */

export { SuppliersScreen } from './ui/supplier/SuppliersScreen';
export { SupplierCompanyScreen } from './ui/supplier/MyCompanyScreen';
export { SupplierSummaryScreen } from './ui/supplier/SupplierSummaryScreen';
export { SupplierDetailScreen } from './ui/supplier/SupplierDetailScreen';

export { BuyersScreen } from './ui/buyer/BuyersScreen';
export { BuyerDetailScreen } from './ui/buyer/BuyerDetailScreen';
export { BuyerCompanyScreen } from './ui/buyer/MyCompanyScreen';
export { DeliveryLocationsScreen } from './ui/common/DeliveryLocationsScreen';
export { DeliveryLocationPicker } from './ui/common/DeliveryLocationPicker';

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
export type { Buyer, UpdateBuyerRequest } from './model/buyer.types';
export type { DeliveryLocation } from './model/deliveryLocation.types';
export { useGetDeliveryLocationsQuery } from './api/deliveryLocationsApi';
