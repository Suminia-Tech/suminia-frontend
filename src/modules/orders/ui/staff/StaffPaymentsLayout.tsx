'use client';

import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';

import { PageHeader, PageSkeleton, PageTabs } from '@/shared/ui';

import { PAYMENT_QUEUE_TABS, QUEUES } from '../common/OrdersListScreen';

/* La cabecera de "Pagos" y sus bandejas en pestañas. Es el layout de las
   seis rutas, de modo que al pasar de una a otra se queda quieta: solo
   cambia la lista de abajo. La descripcion es la de la bandeja elegida, y va
   debajo de las pestañas: encima, cada bandeja la tenia de distinto largo y
   la barra saltaba de altura al cambiar.

   La pestaña se marca en el clic, no cuando llega la pagina: mientras la
   nueva carga, la lista de abajo es su esqueleto. Sin esto la anterior se
   quedaba en pantalla, con su pestaña encendida, hasta que llegaba la otra.
   Se recuerda desde que ruta se pidio el cambio: en cuanto la ruta es otra
   —la pedida, o cualquiera si el usuario vuelve atras—, ya no se espera. */
export const StaffPaymentsLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [pedida, setPedida] = useState<{ desde: string; key: string } | null>(null);

  const cargando = pedida !== null && pedida.desde === pathname;
  const actual =
    PAYMENT_QUEUE_TABS.find((tab) => pathname === tab.href) ?? PAYMENT_QUEUE_TABS[0];
  const activa = cargando
    ? (PAYMENT_QUEUE_TABS.find((tab) => tab.key === pedida.key) ?? actual)
    : actual;

  return (
    <>
      <PageHeader title='Pagos' />
      <PageTabs
        label='Bandejas de pagos'
        tabs={PAYMENT_QUEUE_TABS}
        active={activa.key}
        onSelect={(key) => {
          if (key !== actual.key) setPedida({ desde: pathname, key });
        }}
      />
      <p className='page-tabs-description font-light'>{QUEUES[activa.key].descripcion}</p>
      {cargando ? <PageSkeleton variant='list' header={false} /> : children}
    </>
  );
};

export default StaffPaymentsLayout;
