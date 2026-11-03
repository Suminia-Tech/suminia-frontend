'use client';

import Link from 'next/link';
import { AlertTriangle, Check } from 'react-feather';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDay } from '@/shared/lib/dates';
import { PageHeader, PageSkeleton, Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetFinanceSummaryQuery } from '../../api/financeApi';
import { monthName, pesos } from '../../lib/format';

/* El tablero de finanzas: lo que espera a alguien y lo que se movio.

   Lo pendiente va primero y cada linea lleva a su bandeja, como en el Resumen
   del area: un comprobante sin verificar frena un despacho, y una liquidacion
   sin pagar es un proveedor esperando su plata. Despues el mes —lo que entro,
   lo que gano Suminia y lo que se le transfirio a los proveedores— y los meses
   anteriores para comparar. */
export const FinanceSummaryScreen = () => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const { data, isLoading, isError, error } = useGetFinanceSummaryQuery(undefined, {
    skip: !hydrated,
  });

  if (!hydrated || isLoading) return <PageSkeleton variant='dashboard' />;
  if (isError || !data) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudo cargar el resumen financiero.')}
      </div>
    );
  }

  const { month, pending, history, nextPayoutDate } = data.data;
  const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

  const pendientes = [
    pending.toVerify.count > 0 && {
      texto: `${plural(pending.toVerify.count, 'comprobante', 'comprobantes')} por verificar (${pesos(pending.toVerify.amount)}).`,
      href: '/admin/finance/payments',
    },
    pending.openClaims > 0 && {
      texto: `${plural(pending.openClaims, 'reclamo abierto', 'reclamos abiertos')}: el pedido no se cierra ni se liquida hasta resolverlo.`,
      href: '/admin/finance/claims',
    },
    pending.toInvoiceBuyers > 0 && {
      texto: `${plural(pending.toInvoiceBuyers, 'pedido cobrado', 'pedidos cobrados')} sin la factura de Suminia al comprador.`,
      href: '/admin/finance/to-invoice',
    },
    pending.refunds.count > 0 && {
      texto: `${plural(pending.refunds.count, 'pedido pagado se cayó', 'pedidos pagados se cayeron')}: hay que devolver ${pesos(pending.refunds.amount)}.`,
      href: '/admin/finance/refunds',
    },
    pending.readyToPayout.count > 0 && {
      texto: `${pesos(pending.readyToPayout.amount)} listos para liquidar a ${plural(pending.readyToPayout.suppliers, 'proveedor', 'proveedores')}.`,
      href: '/admin/finance/payouts',
    },
    pending.payoutsUnpaid.count > 0 && {
      texto: `${plural(pending.payoutsUnpaid.count, 'liquidación generada', 'liquidaciones generadas')} sin pagar (${pesos(pending.payoutsUnpaid.amount)}).`,
      href: '/admin/finance/payouts',
    },
    pending.credit.overdueOrders > 0 && {
      texto: `${plural(pending.credit.overdueOrders, 'pago a crédito vencido', 'pagos a crédito vencidos')} por ${pesos(pending.credit.overdue)}.`,
      href: '/admin/finance/credit',
    },
    pending.missingInvoices > 0 && {
      texto: `${plural(pending.missingInvoices, 'pedido despachado', 'pedidos despachados')} sin la factura del proveedor a Suminia.`,
      href: '/admin/finance/invoices',
    },
  ].filter((p): p is { texto: string; href: string } => Boolean(p));

  return (
    <>
      <PageHeader
        title='Resumen financiero'
        description='Lo que espera a alguien y lo que se ha movido: pagos, comisión y liquidaciones.'
      />

      <Panel title='Pendiente' description={`Próxima liquidación: ${formatDay(nextPayoutDate)}.`}>
        {pendientes.length > 0 ? (
          <ul className='summary-todo'>
            {pendientes.map((pendiente) => (
              <li key={pendiente.texto}>
                <AlertTriangle size={17} />
                <span>{pendiente.texto}</span>
                <Link href={pendiente.href}>Revisar</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className='summary-ready'>
            <Check size={17} />
            No hay pagos, devoluciones ni liquidaciones pendientes.
          </p>
        )}
      </Panel>

      <Panel
        title={monthName(month.month)}
        description='Recaudado es lo verificado en el banco; la comisión, la de lo entregado este mes; liquidado, lo transferido a los proveedores.'
      >
        <ul className='data-list'>
          <li>
            <span className='font-light'>Recaudado</span>
            <span>{pesos(month.collected)}</span>
          </li>
          <li>
            <span className='font-light'>Comisión ganada</span>
            <span>{pesos(month.commission)}</span>
          </li>
          <li>
            <span className='font-light'>Liquidado a proveedores</span>
            <span>{pesos(month.paidOut)}</span>
          </li>
          <li>
            <span className='font-light'>Esperando pago</span>
            <span>
              {pesos(pending.awaitingPayment.amount)} · {pending.awaitingPayment.count}{' '}
              {pending.awaitingPayment.count === 1 ? 'pedido' : 'pedidos'}
            </span>
          </li>
          <li>
            <span className='font-light'>Cartera a crédito</span>
            <span>
              {pesos(pending.credit.outstanding)} · {pending.credit.buyers}{' '}
              {pending.credit.buyers === 1 ? 'comprador' : 'compradores'} con crédito
            </span>
          </li>
          <li>
            <span className='font-light'>Por liquidar</span>
            <span>{pesos(pending.readyToPayout.amount)}</span>
          </li>
        </ul>
      </Panel>

      <Panel title='Meses anteriores'>
        <div className='catalog-table-scroll'>
          <table className='catalog-table'>
            <thead>
              <tr>
                <th>Mes</th>
                <th className='num'>Recaudado</th>
                <th className='num'>Comisión ganada</th>
                <th className='num'>Liquidado</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(1).map((item) => (
                <tr key={item.month}>
                  <td>{monthName(item.month)}</td>
                  <td className='num'>{pesos(item.collected)}</td>
                  <td className='num'>{pesos(item.commission)}</td>
                  <td className='num'>{pesos(item.paidOut)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
};

export default FinanceSummaryScreen;
