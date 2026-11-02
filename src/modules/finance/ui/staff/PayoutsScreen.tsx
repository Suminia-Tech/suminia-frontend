'use client';

import Link from 'next/link';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDay } from '@/shared/lib/dates';
import { hasPermission } from '@/shared/lib/permissions';
import { PageHeader, Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useCreatePayoutMutation, useGetPayableQuery } from '../../api/financeApi';
import { pesos } from '../../lib/format';
import type { PayableSupplier } from '../../model/finance.types';
import PayoutsList from '../common/PayoutsList';

/* Las liquidaciones a los proveedores.

   Arriba lo que ya se puede liquidar, por proveedor: lo entregado que paso
   los dias de reclamo. Se genera una liquidacion por proveedor con todo lo
   suyo, se transfiere por el banco y se marca pagada en su ficha. Lo que
   todavia esta en reclamo se dice aparte, para saber que viene.

   Abajo, las ya generadas. */
export const PayoutsScreen = () => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  const puedeLiquidar = hasPermission(permissions, 'finance:manage');
  const { data, isLoading } = useGetPayableQuery(undefined, {
    skip: !hydrated || !puedeLiquidar,
  });
  const proveedores = data?.data ?? [];
  const listos = proveedores.filter((p) => p.ready.length > 0);
  const pronto = proveedores.filter((p) => p.ready.length === 0 && p.upcoming.length > 0);

  return (
    <>
      <PageHeader
        title='Liquidaciones'
        description='Lo que Suminia les transfiere a los proveedores: sus pedidos entregados menos la comisión.'
      />

      {puedeLiquidar && (
        <Panel
          title='Por liquidar'
          description='Pedidos entregados que ya pasaron los días de reclamo. Por transferencia, solo los pagados; a crédito entran aunque el comprador no haya pagado.'
        >
          {isLoading ? (
            <p className='font-light mb-0'>Cargando...</p>
          ) : listos.length === 0 ? (
            <p className='font-light mb-0'>No hay nada listo para liquidar.</p>
          ) : (
            listos.map((proveedor) => <PayableBlock key={proveedor.supplier.id} payable={proveedor} />)
          )}
          {pronto.length > 0 && (
            <p className='font-light payout-upcoming'>
              En días de reclamo:{' '}
              {pronto
                .map((p) => `${p.supplier.name} ${pesos(p.upcomingNet)}`)
                .join(' · ')}
              .
            </p>
          )}
        </Panel>
      )}

      <Panel title='Generadas'>
        <PayoutsList basePath='/admin/finance/payouts' side='staff' />
      </Panel>
    </>
  );
};

const PayableBlock = ({ payable }: { payable: PayableSupplier }) => {
  const [create, { isLoading }] = useCreatePayoutMutation();
  const { supplier } = payable;
  const sinCuenta = !supplier.accountNumber;

  const generar = async () => {
    try {
      const payout = (await create(supplier.id).unwrap()).data;
      toast.success(`Liquidación ${payout.code} generada`);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo generar la liquidación.'));
    }
  };

  return (
    <div className='payout-block'>
      <div className='payout-block-head'>
        <div>
          <strong>{supplier.name}</strong>
          <small className='font-light'>
            {sinCuenta
              ? 'Sin cuenta bancaria registrada'
              : `${supplier.bankName ?? ''} · ${supplier.accountType?.toLowerCase() ?? ''} ${supplier.accountNumber}`}
            {payable.upcoming.length > 0 &&
              ` · ${pesos(payable.upcomingNet)} más en días de reclamo`}
          </small>
        </div>
        <span className='orders-total'>
          <strong>{pesos(payable.readyNet)}</strong>
          <small className='font-light'>
            {payable.ready.length} {payable.ready.length === 1 ? 'pedido' : 'pedidos'}
          </small>
        </span>
        <button
          type='button'
          className='btn btn-primary btn-sm'
          disabled={isLoading}
          onClick={generar}
        >
          {isLoading ? 'Generando...' : 'Generar liquidación'}
        </button>
      </div>

      {payable.missingInvoices > 0 && (
        <p className='panel-warning'>
          {payable.missingInvoices}{' '}
          {payable.missingInvoices === 1 ? 'pedido no tiene' : 'pedidos no tienen'} la factura del
          proveedor. Conviene pedírsela antes de liquidar.
        </p>
      )}

      <div className='catalog-table-scroll'>
        <table className='catalog-table'>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Comprador</th>
              <th>Entregado</th>
              <th>Factura</th>
              <th className='num'>Total</th>
              <th className='num'>Comisión</th>
              <th className='num'>Al proveedor</th>
            </tr>
          </thead>
          <tbody>
            {payable.ready.map((order) => (
              <tr key={order.id}>
                <td className='is-nowrap'>
                  <Link href={`/admin/orders/${order.id}`}>{order.code}</Link>
                </td>
                <td>{order.buyerName}</td>
                <td className='is-nowrap'>{order.deliveredAt ? formatDay(order.deliveredAt) : '—'}</td>
                <td className={order.invoiceNumber ? undefined : 'font-light'}>
                  {order.invoiceNumber ?? 'Falta'}
                </td>
                <td className='num is-nowrap'>{pesos(order.total)}</td>
                <td className='num is-nowrap'>
                  {pesos(order.commissionAmount)} ({order.commissionRate}%)
                </td>
                <td className='num is-nowrap'>{pesos(order.supplierPayout)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutsScreen;
