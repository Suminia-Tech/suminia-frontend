import type { Metadata } from 'next';

import { SupplierProductMarkupsPanel } from '@/modules/finance';
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

  /* El incremento de sus productos es de finanzas y la ficha de
     organizations: la pagina las pone una debajo de la otra. */
  return (
    <>
      <SupplierDetailScreen supplierId={id} />
      <SupplierProductMarkupsPanel supplierId={id} />
    </>
  );
}
