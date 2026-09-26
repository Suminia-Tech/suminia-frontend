import type { Metadata } from 'next';

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

  return <SupplierDetailScreen supplierId={id} />;
}
