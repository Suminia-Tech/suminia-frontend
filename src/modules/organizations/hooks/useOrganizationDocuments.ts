import { useMemo } from 'react';

import {
  useConfirmBuyerDocumentMutation,
  useCreateBuyerDocumentUploadUrlMutation,
  useGetBuyerDocumentUrlMutation,
} from '../api/buyersApi';
import {
  useConfirmLocationDocumentMutation,
  useCreateLocationDocumentUploadUrlMutation,
  useGetLocationDocumentUrlMutation,
} from '../api/deliveryLocationsApi';
import {
  useConfirmSupplierDocumentMutation,
  useCreateSupplierDocumentUploadUrlMutation,
  useGetSupplierDocumentUrlMutation,
} from '../api/suppliersApi';
import type { LocationDocumentType } from '../model/deliveryLocation.types';
import type { OrganizationDocumentType } from '../model/organization.types';
import type { OrganizationKind } from './useOrganizationAdmin';
import { useDocumentFlow } from './useDocumentFlow';

/* Los documentos legales de una empresa. Proveedor y comprador suben lo mismo
   por rutas distintas —/suppliers y /buyers—, de modo que se piden las dos
   mutaciones y se usa la del lado que toca: los hooks no se pueden llamar de
   forma condicional. */
export const useOrganizationDocuments = (kind: OrganizationKind, organizationId: string) => {
  const [supplierUpload] = useCreateSupplierDocumentUploadUrlMutation();
  const [supplierConfirm] = useConfirmSupplierDocumentMutation();
  const [supplierUrl] = useGetSupplierDocumentUrlMutation();
  const [buyerUpload] = useCreateBuyerDocumentUploadUrlMutation();
  const [buyerConfirm] = useConfirmBuyerDocumentMutation();
  const [buyerUrl] = useGetBuyerDocumentUrlMutation();

  const endpoints = useMemo(
    () =>
      kind === 'supplier'
        ? {
            requestUpload: async (contentType: string) =>
              (await supplierUpload({ supplierId: organizationId, contentType }).unwrap()).data,
            confirm: (type: OrganizationDocumentType, storageKey: string, filename: string) =>
              supplierConfirm({
                supplierId: organizationId,
                data: { type, storageKey, filename },
              }).unwrap(),
            getUrl: async (documentId: string) =>
              (await supplierUrl({ supplierId: organizationId, documentId }).unwrap()).data.url,
          }
        : {
            requestUpload: async (contentType: string) =>
              (await buyerUpload({ organizationId, contentType }).unwrap()).data,
            confirm: (type: OrganizationDocumentType, storageKey: string, filename: string) =>
              buyerConfirm({ organizationId, data: { type, storageKey, filename } }).unwrap(),
            getUrl: async (documentId: string) =>
              (await buyerUrl({ organizationId, documentId }).unwrap()).data.url,
          },
    [
      kind,
      organizationId,
      supplierUpload,
      supplierConfirm,
      supplierUrl,
      buyerUpload,
      buyerConfirm,
      buyerUrl,
    ],
  );

  return useDocumentFlow<OrganizationDocumentType>(endpoints);
};

/* Los soportes de una sede de entrega. */
export const useLocationDocuments = (locationId: string) => {
  const [requestUpload] = useCreateLocationDocumentUploadUrlMutation();
  const [confirm] = useConfirmLocationDocumentMutation();
  const [getUrl] = useGetLocationDocumentUrlMutation();

  const endpoints = useMemo(
    () => ({
      requestUpload: async (contentType: string) =>
        (await requestUpload({ locationId, contentType }).unwrap()).data,
      confirm: (type: LocationDocumentType, storageKey: string, filename: string) =>
        confirm({ locationId, data: { type, storageKey, filename } }).unwrap(),
      getUrl: async (documentId: string) =>
        (await getUrl({ locationId, documentId }).unwrap()).data.url,
    }),
    [locationId, requestUpload, confirm, getUrl],
  );

  return useDocumentFlow<LocationDocumentType>(endpoints);
};
