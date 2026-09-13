'use client';

import type { ReactNode } from 'react';

import Layout6 from '@/_template/Layout/Layout6';
import { AreaGuard, PendingApprovalNotice } from '@/modules/auth';

/* El area del comprador no tiene chasis propio: lleva el mismo de la tienda.

   Es deliberado. El comprador compra, y lo hace en la misma tienda que ve un
   visitante —cabecera con buscador, categorias y carrito—. Darle el panel
   lateral del proveedor lo dejaria en un sitio de trabajo, que no es lo suyo.
   Lo unico que cuelga de /buyer es su cuenta: los datos de su empresa, su
   equipo y su perfil.

   La guarda va dentro y no fuera para que la cabecera de la tienda este puesta
   desde el primer momento, incluso mientras se lee la sesion. */
const BuyerLayout = ({ children }: { children: ReactNode }) => (
  <Layout6 isCategories={true}>
    <PendingApprovalNotice />
    <AreaGuard area='buyer'>{children}</AreaGuard>
  </Layout6>
);

export default BuyerLayout;
