import type { ReactNode } from 'react';

import Layout6 from '@/_template/Layout/Layout6';
import { PendingApprovalNotice } from '@/modules/auth';

/* El chasis de la tienda: catalogo, ficha de producto y carrito.

   El catalogo se servia pelado —sin cabecera, sin buscador y sin pie—, de modo
   que quien llegaba desde la portada perdia de golpe toda la navegacion y no
   tenia como volver. Es la misma tienda que ve un visitante, y lleva el mismo
   chasis que la portada.

   Va en un grupo de rutas y no en cada pagina para no repetirlo: `(store)` no
   aparece en la URL, que sigue siendo /catalog y /cart. Lo demas de `(suminia)`
   —registro, verificacion de correo— se queda fuera a proposito: son paginas de
   tramite y no tienen tienda que enseñar.

   Aqui va tambien la franja de cuenta en revision: es justo donde se notan los
   precios que faltan, y las pantallas dan por hecho que alguien ya lo explico
   arriba. */
export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <Layout6 isCategories={true}>
      <PendingApprovalNotice />
      {children}
    </Layout6>
  );
}
