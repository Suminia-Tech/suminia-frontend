import type { ReactNode } from 'react';

import Layout6 from '@/_template/Layout/Layout6';
import { PendingApprovalNotice } from '@/modules/auth';

/* El catalogo se servia pelado: sin cabecera, sin buscador y sin pie. Quien
   llegaba desde la portada —por el menu, por el buscador o por una categoria—
   perdia de golpe toda la navegacion y no tenia como volver.

   Es la misma tienda que ve un visitante, de modo que lleva el mismo chasis que
   la portada. Y aqui va tambien la franja de cuenta en revision: es justo donde
   se notan los precios que faltan, y la pantalla del catalogo da por hecho que
   alguien ya lo explico arriba. */
export default function CatalogLayout({ children }: { children: ReactNode }) {
  return (
    <Layout6 isCategories={true}>
      <PendingApprovalNotice />
      {children}
    </Layout6>
  );
}
