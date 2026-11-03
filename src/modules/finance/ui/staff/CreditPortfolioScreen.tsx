'use client';

import Link from 'next/link';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDay } from '@/shared/lib/dates';
import { PageHeader, PageSkeleton, Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetCreditPortfolioQuery } from '../../api/financeApi';
import { pesos } from '../../lib/format';

/* La cartera a credito: quien tiene credito, cuanto debe y que esta vencido.
   El riesgo es de Suminia —al proveedor se le liquida igual—, de modo que
   aqui se mira lo que Suminia tiene por cobrar. El credito se da o se quita
   en la ficha de cada comprador. */
export const CreditPortfolioScreen = () => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const { data, isLoading, isError, error } = useGetCreditPortfolioQuery(undefined, {
    skip: !hydrated,
  });

  if (!hydrated || isLoading) return <PageSkeleton variant='list' />;
  if (isError || !data) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudo cargar la cartera.')}
      </div>
    );
  }

  const filas = data.data;
  const deuda = filas.reduce((s, f) => s + f.credit.used, 0);
  const vencido = filas.reduce((s, f) => s + f.credit.overdue, 0);

  return (
    <>
      <PageHeader
        title='Crédito'
        description='Los compradores con crédito de Suminia, lo que deben y lo vencido. El crédito se da en la ficha de cada comprador.'
      />

      <Panel title='Cartera'>
        <ul className='data-list'>
          <li>
            <span className='font-light'>Por cobrar</span>
            <span>{pesos(deuda)}</span>
          </li>
          <li>
            <span className='font-light'>Vencido</span>
            <span>{pesos(vencido)}</span>
          </li>
        </ul>
      </Panel>

      <Panel title='Compradores'>
        {filas.length === 0 ? (
          <p className='font-light mb-0'>
            Ningún comprador tiene crédito todavía. Dáselo desde su ficha en Compradores.
          </p>
        ) : (
          <div className='catalog-table-scroll'>
            <table className='catalog-table'>
              <thead>
                <tr>
                  <th>Comprador</th>
                  <th>Crédito</th>
                  <th className='num'>Cupo</th>
                  <th className='num'>Debe</th>
                  <th className='num'>Disponible</th>
                  <th className='num'>Vencido</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((fila) => (
                  <tr key={fila.organizationId}>
                    <td>
                      <Link href={`/admin/buyers/${fila.organizationId}`}>{fila.name}</Link>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${fila.credit.enabled ? 'status-success' : 'status-muted'}`}
                      >
                        {fila.credit.enabled ? `${fila.credit.days} días` : 'Cerrado'}
                      </span>
                    </td>
                    <td className='num'>{fila.credit.limit ? pesos(fila.credit.limit) : '—'}</td>
                    <td className='num'>{pesos(fila.credit.used)}</td>
                    <td className='num'>{pesos(fila.credit.available)}</td>
                    <td className='num'>
                      {fila.credit.overdue > 0 ? (
                        <span className='status-pill status-danger'>
                          {pesos(fila.credit.overdue)}
                          {fila.credit.oldestDueAt && ` desde el ${formatDay(fila.credit.oldestDueAt)}`}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className='font-light mt-3 mb-0'>
          <Link href='/admin/finance/overdue'>Ver los pedidos con pago vencido</Link>
        </p>
      </Panel>
    </>
  );
};

export default CreditPortfolioScreen;
