import type { Metadata } from 'next';
import { Suspense } from 'react';

import BreadCrumb from '@/_template/Components/Element/BreadCrumb';
import Layout6 from '@/_template/Layout/Layout6';
import { VerifyEmailScreen } from '@/modules/auth';

export const metadata: Metadata = {
  title: 'Verificar correo | Suminia',
};

export default function VerifyEmailPage() {
  return (
    <Layout6 isCategories={true}>
      <BreadCrumb parent={'Verificar correo'} title={'Verificar correo'} />
      {/* useSearchParams necesita un limite de Suspense para no forzar el
          renderizado dinamico de toda la ruta. */}
      <Suspense fallback={null}>
        <VerifyEmailScreen />
      </Suspense>
    </Layout6>
  );
}
