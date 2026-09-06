import type { Metadata } from 'next';

import BreadCrumb from '@/_template/Components/Element/BreadCrumb';
import { SuppliersScreen } from '@/modules/organizations';

export const metadata: Metadata = {
  title: 'Proveedores',
  description: 'Laboratorios, fabricantes e importadores registrados en Suminia.',
};

export default function ProveedoresPage() {
  return (
    <>
      <BreadCrumb parent={'Proveedores'} title={'Proveedores'} />
      <SuppliersScreen />
    </>
  );
}
