import type { Metadata } from 'next';

import BreadCrumb from '@/_template/Components/Element/BreadCrumb';
import Layout6 from '@/_template/Layout/Layout6';
import { MyProductsScreen } from '@/modules/products';

export const metadata: Metadata = {
  title: 'Mis productos',
  description: 'Administra el catálogo que tu empresa publica en Suminia.',
};

export default function ProductsPage() {
  return (
    <Layout6 isCategories={true}>
      <BreadCrumb parent={'Mis productos'} title={'Mis productos'} />
      <MyProductsScreen />
    </Layout6>
  );
}
