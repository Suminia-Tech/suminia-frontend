'use client';

import Link from 'next/link';
import { AlertTriangle, Check } from 'react-feather';

import { useGetBuyersQuery, useGetSuppliersQuery } from '@/modules/organizations';
import { useGetOrdersQuery } from '@/modules/orders';
import { PageHeader, Panel } from '@/shared/ui';

/* El resumen del personal de Suminia: que hay que hacer hoy y cuanto se movio.

   Vive aqui y no en un modulo porque cruza tres —organizations para las
   empresas que esperan aprobacion, orders para lo que se facturo— y un modulo
   nunca importa otro. La pagina si los ve a todos, que es justo para lo que
   esta: juntar lo que cada modulo expone.

   Dice dos cosas, en este orden. Primero lo que espera una decision: una
   empresa pendiente no puede operar, y mientras nadie la mire el marketplace
   tiene un proveedor menos. Despues el dinero, que es lo que se consulta
   cuando no hay nada pendiente.

   Las cifras no piden endpoints nuevos: salen del `meta.totalCount` de los
   listados que ya existen, pidiendo una pagina de uno. */

const pesos = (valor: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);

/* Una pagina de uno: lo que interesa es el total que devuelve el meta, no las
   filas. Pedir cien para contarlas seria traerse el listado entero. */
const SOLO_EL_TOTAL = { page: 1, limit: 1 } as const;

export const AdminSummary = () => {
  const { data: proveedores } = useGetSuppliersQuery({
    ...SOLO_EL_TOTAL,
    filter: { status: 'PENDING' },
  });
  const { data: compradores } = useGetBuyersQuery({
    ...SOLO_EL_TOTAL,
    filter: { status: 'PENDING' },
  });

  /* Los pedidos si se traen: hace falta sumar la comision de cada uno, y el
     backend no expone todavia un total agregado. Con el volumen de hoy cabe en
     una pagina; el dia que no quepa, la suma se pide al backend. */
  const { data: pedidos } = useGetOrdersQuery({
    page: 1,
    limit: 100,
    sort: 'createdAt',
    sortDirection: 'desc',
  });

  const proveedoresPendientes = proveedores?.data.meta.totalCount ?? 0;
  const compradoresPendientes = compradores?.data.meta.totalCount ?? 0;
  const lista = pedidos?.data.data ?? [];

  /* Los anulados y los rechazados no dejan nada: no se cobraron. */
  const facturables = lista.filter(
    (order) => order.status !== 'CANCELLED' && order.status !== 'REJECTED',
  );
  const facturado = facturables.reduce((suma, order) => suma + order.total, 0);
  const comision = facturables.reduce(
    (suma, order) => suma + (order.commissionAmount ?? 0),
    0,
  );

  const pendientes = [
    proveedoresPendientes > 0 && {
      texto: `${proveedoresPendientes} ${proveedoresPendientes === 1 ? 'proveedor espera' : 'proveedores esperan'} aprobación.`,
      href: '/admin/suppliers',
      enlace: 'Revisar',
    },
    compradoresPendientes > 0 && {
      texto: `${compradoresPendientes} ${compradoresPendientes === 1 ? 'comprador espera' : 'compradores esperan'} aprobación.`,
      href: '/admin/buyers',
      enlace: 'Revisar',
    },
  ].filter((p): p is { texto: string; href: string; enlace: string } => Boolean(p));

  return (
    <>
      <PageHeader
        title='Resumen'
        description='Lo que espera una decisión y lo que se ha movido en la plataforma.'
      />

      <Panel
        title='Pendiente de revisión'
        description='Una empresa sin aprobar no puede operar: ni publica ni compra.'
      >
        {pendientes.length > 0 ? (
          <ul className='summary-todo'>
            {pendientes.map((pendiente) => (
              <li key={pendiente.href}>
                <AlertTriangle size={17} />
                <span>{pendiente.texto}</span>
                <Link href={pendiente.href}>{pendiente.enlace}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className='summary-ready'>
            <Check size={17} />
            No hay empresas esperando aprobación.
          </p>
        )}
      </Panel>

      <Panel
        title='Lo que se ha movido'
        description='Sobre los pedidos que no se anularon ni se rechazaron: esos no se cobran.'
        aside={
          <Link href='/admin/orders' className='btn btn-outline-secondary btn-sm'>
            Ver los pedidos
          </Link>
        }
      >
        <ul className='data-list'>
          <li>
            <span className='font-light'>Pedidos</span>
            <span>{facturables.length}</span>
          </li>
          <li>
            <span className='font-light'>Facturado</span>
            <span>{pesos(facturado)}</span>
          </li>
          <li>
            <span className='font-light'>Comisión de Suminia</span>
            <span>{pesos(comision)}</span>
          </li>
        </ul>
      </Panel>
    </>
  );
};

export default AdminSummary;
