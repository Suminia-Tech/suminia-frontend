import type { Metadata } from 'next';

import BreadCrumb from '@/_template/Components/Element/BreadCrumb';
import Layout6 from '@/_template/Layout/Layout6';
import { SupplierDetailScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Proveedor',
};

export default async function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Layout6 isCategories={true}>
      <BreadCrumb parent={'Proveedores'} title={'Proveedor'} />
      <SupplierDetailScreen supplierId={id} />
    </Layout6>
  );
}
