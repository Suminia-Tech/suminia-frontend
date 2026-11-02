'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDay } from '@/shared/lib/dates';
import { hasPermission } from '@/shared/lib/permissions';
import { Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import {
  useGetOrganizationFinanceQuery,
  useUpdateBuyerCreditMutation,
} from '../../api/financeApi';
import { pesos } from '../../lib/format';
import type { OrganizationFinance } from '../../model/finance.types';
import OrganizationChanges from './OrganizationChanges';

/* El credito de un comprador, en su ficha. Solo lo da finanzas, con un cupo
   —lo que puede deber a la vez— y un plazo —los dias desde la entrega para
   pagar—. Quitarlo no borra lo que debe: eso sigue en la cartera. */
export const BuyerCreditPanel = ({ buyerId }: { buyerId: string }) => {
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  const editable = hasPermission(permissions, 'finance:manage');
  const { data } = useGetOrganizationFinanceQuery(buyerId);

  if (!data) return null;
  const { credit } = data.data;

  return (
    <CreditForm
      key={`${credit.enabled}-${credit.limit}-${credit.days}`}
      finance={data.data}
      editable={editable}
    />
  );
};

const CreditForm = ({ finance, editable }: { finance: OrganizationFinance; editable: boolean }) => {
  const { credit } = finance;
  const [update, { isLoading }] = useUpdateBuyerCreditMutation();
  const [limit, setLimit] = useState(credit.limit ? String(credit.limit) : '');
  const [days, setDays] = useState(credit.days ? String(credit.days) : '30');

  const guardar = async (enabled: boolean) => {
    try {
      await update({
        id: finance.organizationId,
        enabled,
        limit: limit ? Number(limit) : null,
        days: days ? Number(days) : null,
      }).unwrap();
      toast.success(enabled ? 'Crédito guardado' : 'Crédito cerrado');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo guardar el crédito.'));
    }
  };

  return (
    <Panel
      className='organization-finance-panel'
      title='Crédito con Suminia'
      description={
        credit.enabled
          ? `Puede pedir a crédito hasta ${pesos(credit.limit ?? 0)} y paga a ${credit.days} días de la entrega.`
          : 'Paga por transferencia antes del despacho. Dale crédito si Suminia asume el riesgo de cobrarle después.'
      }
      aside={
        <span className={`document-state is-${credit.enabled ? 'success' : 'muted'}`}>
          {credit.enabled ? 'Con crédito' : 'Sin crédito'}
        </span>
      }
      footer={
        editable && (
          <>
            {credit.enabled && (
              <button
                type='button'
                className='btn btn-outline-danger btn-sm'
                disabled={isLoading}
                onClick={() => guardar(false)}
              >
                Cerrar crédito
              </button>
            )}
            <button
              type='button'
              className='btn btn-primary btn-sm'
              disabled={isLoading || !limit || !days}
              onClick={() => guardar(true)}
            >
              {isLoading ? 'Guardando...' : credit.enabled ? 'Guardar cambios' : 'Dar crédito'}
            </button>
          </>
        )
      }
    >
      {(credit.enabled || credit.used > 0) && (
        <ul className='data-list'>
          <li>
            <span className='font-light'>Debe</span>
            <span>{pesos(credit.used)}</span>
          </li>
          <li>
            <span className='font-light'>Disponible</span>
            <span>{pesos(credit.available)}</span>
          </li>
          <li>
            <span className='font-light'>Vencido</span>
            <span>
              {credit.overdue > 0
                ? `${pesos(credit.overdue)} desde el ${formatDay(credit.oldestDueAt)}`
                : 'Nada'}
            </span>
          </li>
        </ul>
      )}

      {editable && (
        <div className='form-grid mt-3'>
          <div>
            <label className='form-label' htmlFor='credito-cupo'>
              Cupo
            </label>
            <input
              id='credito-cupo'
              type='number'
              min={1}
              className='form-control'
              placeholder='20000000'
              value={limit}
              onChange={(event) => setLimit(event.target.value)}
            />
            <small className='font-light'>Lo máximo que puede deber a la vez, con IVA.</small>
          </div>
          <div>
            <label className='form-label' htmlFor='credito-plazo'>
              Plazo (días)
            </label>
            <input
              id='credito-plazo'
              type='number'
              min={1}
              max={180}
              className='form-control'
              value={days}
              onChange={(event) => setDays(event.target.value)}
            />
            <small className='font-light'>Desde la entrega de cada pedido.</small>
          </div>
        </div>
      )}
      <OrganizationChanges changes={finance.changes} />
    </Panel>
  );
};

export default BuyerCreditPanel;
