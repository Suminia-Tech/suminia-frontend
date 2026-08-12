import type { Metadata } from 'next';

import BreadCrumb from '@/_template/Components/Element/BreadCrumb';
import Layout6 from '@/_template/Layout/Layout6';
import { SuppliersScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Proveedores',
  description: 'Laboratorios, fabricantes e importadores registrados en Suminia.',
};

export default function SuppliersPage() {
  return (
    <Layout6 isCategories={true}>
      <BreadCrumb parent={'Proveedores'} title={'Proveedores'} />
      <SuppliersScreen />
    </Layout6>
  );
}
