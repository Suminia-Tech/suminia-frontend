'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FileText } from 'react-feather';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate, formatDay } from '@/shared/lib/dates';
import { PageHeader, PageSkeleton, Pagination } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetQuotesQuery } from '../../api/ordersApi';
import { quoteState } from './QuoteDetailScreen';

const PAGE_SIZE = 10;

const pesos = (valor: number, moneda: string) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);

/* Las cotizaciones de la empresa: la misma lista que los pedidos, con su
   vigencia en lugar del estado de la entrega. */
export const QuotesScreen = () => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useGetQuotesQuery(
    { page, limit: PAGE_SIZE },
    { skip: !hydrated },
  );

  if (!hydrated || isLoading) return <PageSkeleton variant='list' />;
  if (isError) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudieron cargar tus cotizaciones.')}
      </div>
    );
  }

  const quotes = data?.data.data ?? [];
  const meta = data?.data.meta;

  return (
    <>
      <PageHeader
        title='Cotizaciones'
        description='Las cotizaciones formales que descargaste del carrito. Conviértelas en pedido mientras estén vigentes.'
      />

      {quotes.length === 0 ? (
        <div className='orders-empty'>
          <FileText size={28} />
          <p className='font-light'>
            Todavía no tienes cotizaciones. Arma tu compra en el carrito y descarga la
            cotización desde ahí.
          </p>
          <Link href='/cart' className='btn btn-primary'>
            Ir al carrito
          </Link>
        </div>
      ) : (
        <ul className='orders-list'>
          {quotes.map((quote) => {
            const estado = quoteState(quote);
            return (
              <li key={quote.id}>
                <Link href={`/buyer/account/quotes/${quote.id}`}>
                  <div className='orders-line-main'>
                    <span className='orders-number'>{quote.code}</span>
                    <span className='orders-supplier'>
                      {quote.suppliers} {quote.suppliers === 1 ? 'proveedor' : 'proveedores'}
                    </span>
                    <small className='font-light'>
                      {formatDate(quote.createdAt)} · {quote.items}{' '}
                      {quote.items === 1 ? 'producto' : 'productos'} · vigente hasta el{' '}
                      {formatDay(quote.validUntil)}
                    </small>
                  </div>
                  <span className={`status-pill ${estado.pill}`}>{estado.label}</span>
                  <span className='orders-total'>
                    <strong>{pesos(quote.total, quote.currency)}</strong>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination meta={meta} onChange={setPage} label='cotizaciones' />
      )}
    </>
  );
};

export default QuotesScreen;
