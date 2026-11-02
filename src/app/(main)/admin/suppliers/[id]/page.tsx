import type { Metadata } from 'next';

import { SupplierCommissionPanel } from '@/modules/finance';
import { SupplierDetailScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Detalle del proveedor',
  description: 'Datos y estado de aprobación de una empresa proveedora.',
};

export default async function ProveedorDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  /* La comision pactada es de finanzas y la ficha de organizations: la
     pagina las pone una debajo de la otra. */
  return (
    <>
      <SupplierDetailScreen supplierId={id} />
      <SupplierCommissionPanel supplierId={id} />
    </>
  );
}
