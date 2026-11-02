'use client';

import Link from 'next/link';
import { useState } from 'react';
import { DollarSign } from 'react-feather';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/dates';
import { Pagination } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetPayoutsQuery } from '../../api/financeApi';
import { pesos } from '../../lib/format';

const PAGE_SIZE = 10;

const ESTADOS = [
  { value: '', label: 'Todas' },
  { value: 'PENDING', label: 'Por pagar' },
  { value: 'PAID', label: 'Pagadas' },
] as const;

/* Las liquidaciones generadas, con la misma lista que los pedidos. El
   proveedor ve las suyas y el personal de Suminia todas: el backend decide. */
export const PayoutsList = ({ basePath, side }: { basePath: string; side: 'staff' | 'supplier' }) => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const [status, setStatus] = useState<'' | 'PENDING' | 'PAID'>('');
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useGetPayoutsQuery(
    { page, limit: PAGE_SIZE, ...(status ? { status } : {}) },
    { skip: !hydrated },
  );

  if (!hydrated || isLoading) return <p className='font-light'>Cargando...</p>;
  if (isError) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudieron cargar las liquidaciones.')}
      </div>
    );
  }

  const payouts = data?.data.data ?? [];
  const meta = data?.data.meta;

  return (
    <>
      <div className='orders-filter'>
        {ESTADOS.map((estado) => (
          <button
            type='button'
            key={estado.value}
            className={status === estado.value ? 'is-chosen' : undefined}
            onClick={() => {
              setStatus(estado.value);
              setPage(1);
            }}
          >
            {estado.label}
          </button>
        ))}
      </div>

      {payouts.length === 0 ? (
        <div className='orders-empty'>
          <DollarSign size={28} />
          <p className='font-light'>
            {side === 'supplier'
              ? 'Todavía no tienes liquidaciones. Los pedidos entregados entran en la siguiente cuando pasan los días de reclamo.'
              : 'Todavía no hay liquidaciones.'}
          </p>
        </div>
      ) : (
        <ul className='orders-list'>
          {payouts.map((payout) => (
            <li key={payout.id}>
              <Link href={`${basePath}/${payout.id}`}>
                <div className='orders-line-main'>
                  <span className='orders-number'>{payout.code}</span>
                  {side === 'staff' && (
                    <span className='orders-supplier'>{payout.supplier.name}</span>
                  )}
                  <small className='font-light'>
                    {formatDate(payout.createdAt)} · {payout.orders}{' '}
                    {payout.orders === 1 ? 'pedido' : 'pedidos'}
                    {payout.paidAt && ` · pagada el ${formatDate(payout.paidAt)}`}
                  </small>
                </div>
                <span
                  className={`status-pill ${payout.status === 'PAID' ? 'status-success' : 'status-neutral'}`}
                >
                  {payout.status === 'PAID' ? 'Pagada' : 'Por pagar'}
                </span>
                <span className='orders-total'>
                  <strong>{pesos(payout.net)}</strong>
                  <small className='font-light'>comisión {pesos(payout.commission)}</small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination meta={meta} onChange={setPage} label='liquidaciones' />
      )}
    </>
  );
};

export default PayoutsList;
