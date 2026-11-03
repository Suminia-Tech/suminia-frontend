'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AlertTriangle, Check, ChevronDown } from 'react-feather';

import { useGetBuyersQuery, useGetSuppliersQuery } from '@/modules/organizations';
import { useGetBillingQuery } from '@/modules/orders';
import { useGetProductsQuery } from '@/modules/products';
import { PageHeader, Panel } from '@/shared/ui';

/* El resumen del personal de Suminia: que hay que hacer hoy y cuanto se movio.

   Vive aqui y no en un modulo porque cruza cuatro —organizations para las
   empresas que esperan aprobacion, products para lo que espera a direccion
   tecnica, orders para lo que se facturo— y un modulo nunca importa otro. La pagina si los ve a todos, que es justo para lo que
   esta: juntar lo que cada modulo expone.

   Dice dos cosas, en este orden. Primero lo que espera una decision: una
   empresa pendiente no puede operar, y mientras nadie la mire el marketplace
   tiene un proveedor menos. Despues el dinero, que es lo que se consulta
   cuando no hay nada pendiente.

   Los pendientes salen del `meta.totalCount` de los listados que ya existen,
   pidiendo una pagina de uno. La facturacion, de /orders/billing, que la
   agrupa por mes en el backend. */

const pesos = (valor: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);

/* "Octubre de 2026". El mes llega como "2026-10" y se lee en UTC para que no
   retroceda un dia —y con el, un mes— por la zona horaria. */
const FORMATO_MES = new Intl.DateTimeFormat('es-CO', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});
const nombreDelMes = (month: string) => {
  const texto = FORMATO_MES.format(new Date(`${month}-01T00:00:00Z`));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

/* El mes en curso en Colombia, como lo agrupa el backend: "2026-10". */
const mesActual = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
  }).format(new Date());

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
  const { data: productos } = useGetProductsQuery({
    ...SOLO_EL_TOTAL,
    filter: { status: 'PENDING_REVIEW' },
  });

  const { data: facturacion } = useGetBillingQuery();
  const [verAnteriores, setVerAnteriores] = useState(false);

  const proveedoresPendientes = proveedores?.data.meta.totalCount ?? 0;
  const compradoresPendientes = compradores?.data.meta.totalCount ?? 0;
  const productosPendientes = productos?.data.meta.totalCount ?? 0;

  /* Se ve el mes en curso; los anteriores quedan plegados debajo. Un mes sin
     pedidos no llega del backend, de modo que el actual se completa en cero
     en vez de desaparecer. */
  const mes = mesActual();
  const meses = facturacion?.data ?? [];
  const actual = meses.find((item) => item.month === mes) ?? {
    month: mes,
    orders: 0,
    billed: 0,
    commission: 0,
  };
  const anteriores = meses.filter((item) => item.month < mes);

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
    productosPendientes > 0 && {
      texto: `${productosPendientes} ${productosPendientes === 1 ? 'producto espera' : 'productos esperan'} la revisión de dirección técnica.`,
      href: '/admin/products',
      enlace: 'Revisar',
    },
  ].filter((p): p is { texto: string; href: string; enlace: string } => Boolean(p));

  return (
    <>
      <PageHeader
        title='Resumen'
        description='Lo que espera una decisión y lo que se ha facturado en la plataforma.'
      />

      <Panel
        title='Pendiente de revisión'
        description='Una empresa sin aprobar no puede operar, y un producto sin revisar no llega al catálogo.'
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
            No hay empresas ni productos esperando revisión.
          </p>
        )}
      </Panel>

      <Panel
        title='Facturación'
        description={`${nombreDelMes(mes)}. Sobre los pedidos que no se anularon ni se rechazaron: esos no se cobran.`}
        aside={
          <Link href='/admin/orders' className='btn btn-outline-secondary btn-sm'>
            Ver los pedidos
          </Link>
        }
      >
        <ul className='data-list'>
          <li>
            <span className='font-light'>Pedidos</span>
            <span>{actual.orders}</span>
          </li>
          <li>
            <span className='font-light'>Facturado</span>
            <span>{pesos(actual.billed)}</span>
          </li>
          <li>
            <span className='font-light'>Margen de Suminia</span>
            <span>{pesos(actual.commission)}</span>
          </li>
        </ul>

        {/* Los meses anteriores, plegados: se consultan, no se miran cada
            dia. El mismo control que el historial de versiones de los
            documentos. */}
        {anteriores.length > 0 && (
          <>
            <button
              type='button'
              className='document-history-toggle'
              aria-expanded={verAnteriores}
              onClick={() => setVerAnteriores((current) => !current)}
            >
              <ChevronDown size={14} />
              {verAnteriores ? 'Ocultar' : 'Ver'} meses anteriores ({anteriores.length})
            </button>
            {verAnteriores && (
              <div className='catalog-table-scroll billing-history'>
                <table className='catalog-table'>
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th className='num'>Pedidos</th>
                      <th className='num'>Facturado</th>
                      <th className='num'>Margen de Suminia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anteriores.map((item) => (
                      <tr key={item.month}>
                        <td>{nombreDelMes(item.month)}</td>
                        <td className='num'>{item.orders}</td>
                        <td className='num'>{pesos(item.billed)}</td>
                        <td className='num'>{pesos(item.commission)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Panel>
    </>
  );
};

export default AdminSummary;
