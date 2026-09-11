'use client';

import OrganizationDetailScreen from '../common/OrganizationDetailScreen';

export const SupplierDetailScreen = ({ supplierId }: { supplierId: string }) => (
  <OrganizationDetailScreen kind='supplier' organizationId={supplierId} />
);

export default SupplierDetailScreen;
