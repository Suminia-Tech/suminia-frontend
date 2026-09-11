import type { Metadata } from 'next';

import BreadCrumb from '@/_template/Components/Element/BreadCrumb';
import { BuyersScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Compradores',
  description: 'Clínicas, hospitales y distribuidores registrados en Suminia.',
};

export default function CompradoresPage() {
  return (
    <>
      <BreadCrumb parent={'Compradores'} title={'Compradores'} />
      <BuyersScreen />
    </>
  );
}
