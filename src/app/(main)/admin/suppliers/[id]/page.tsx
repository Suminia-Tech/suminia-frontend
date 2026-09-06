import type { Metadata } from 'next';

import BreadCrumb from '@/_template/Components/Element/BreadCrumb';
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

  return (
    <>
      <BreadCrumb parent={'Proveedores'} title={'Detalle del proveedor'} />
      <SupplierDetailScreen supplierId={id} />
    </>
  );
}
