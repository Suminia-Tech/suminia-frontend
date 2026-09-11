'use client';

import OrganizationDetailScreen from '../common/OrganizationDetailScreen';

export const BuyerDetailScreen = ({ buyerId }: { buyerId: string }) => (
  <OrganizationDetailScreen kind='buyer' organizationId={buyerId} />
);

export default BuyerDetailScreen;
