import type { Metadata } from 'next';

import BreadCrumb from '@/_template/Components/Element/BreadCrumb';
import Layout6 from '@/_template/Layout/Layout6';
import { MyCompanyScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Mi empresa',
  description: 'Datos de tu empresa y estado de aprobación en Suminia.',
};

export default function MyCompanyPage() {
  return (
    <Layout6 isCategories={true}>
      <BreadCrumb parent={'Mi cuenta'} title={'Mi empresa'} />
      <MyCompanyScreen />
    </Layout6>
  );
}
