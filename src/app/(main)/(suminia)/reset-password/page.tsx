import type { Metadata } from 'next';
import { Suspense } from 'react';

import BreadCrumb from '@/_template/Components/Element/BreadCrumb';
import Layout6 from '@/_template/Layout/Layout6';
import { ResetPasswordScreen } from '@/modules/auth';

export const metadata: Metadata = {
  title: 'Restablecer contraseña | Suminia',
};

export default function ResetPasswordPage() {
  return (
    <Layout6 isCategories={true}>
      <BreadCrumb parent={'Restablecer contraseña'} title={'Restablecer contraseña'} />
      {/* useSearchParams necesita un limite de Suspense para no forzar el
          renderizado dinamico de toda la ruta. */}
      <Suspense fallback={null}>
        <ResetPasswordScreen />
      </Suspense>
    </Layout6>
  );
}
