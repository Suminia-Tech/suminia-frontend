'use client';

import { PageHeader } from '@/shared/ui';

import PayoutsList from '../common/PayoutsList';

/* Las liquidaciones del proveedor: lo que Suminia le ha transferido y lo que
   tiene por pagarle, con el detalle de cada pedido. */
export const SupplierPayoutsScreen = () => (
  <>
    <PageHeader
      title='Liquidaciones'
      description='Lo que Suminia te transfiere por tus pedidos entregados, ya descontada la comisión.'
    />
    <PayoutsList basePath='/supplier/payouts' side='supplier' />
  </>
);

export default SupplierPayoutsScreen;
