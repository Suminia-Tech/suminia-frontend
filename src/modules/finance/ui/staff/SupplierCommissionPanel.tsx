'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { hasPermission } from '@/shared/lib/permissions';
import { Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import {
  useGetFinanceSettingsQuery,
  useGetOrganizationFinanceQuery,
  useUpdateSupplierCommissionMutation,
} from '../../api/financeApi';
import type { OrganizationFinance } from '../../model/finance.types';
import OrganizationChanges from './OrganizationChanges';

/* La comision pactada con un proveedor, en su ficha. Vacia es "la general":
   cambiar la general lo alcanza; una pactada se queda hasta que se quite. */
export const SupplierCommissionPanel = ({ supplierId }: { supplierId: string }) => {
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  const editable = hasPermission(permissions, 'finance:manage');
  const { data } = useGetOrganizationFinanceQuery(supplierId);
  const { data: settings } = useGetFinanceSettingsQuery();

  if (!data) return null;

  return (
    <CommissionForm
      key={String(data.data.commissionRate)}
      finance={data.data}
      general={settings?.data.commissionRate ?? null}
      editable={editable}
    />
  );
};

const CommissionForm = ({
  finance,
  general,
  editable,
}: {
  finance: OrganizationFinance;
  general: number | null;
  editable: boolean;
}) => {
  const [update, { isLoading }] = useUpdateSupplierCommissionMutation();
  const [rate, setRate] = useState(
    finance.commissionRate === null ? '' : String(finance.commissionRate),
  );
  const actual = finance.commissionRate === null ? '' : String(finance.commissionRate);

  const guardar = async (valor: number | null) => {
    try {
      await update({ id: finance.organizationId, rate: valor }).unwrap();
      toast.success(valor === null ? 'Vuelve a la comisión general' : 'Comisión pactada guardada');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo guardar la comisión.'));
    }
  };

  return (
    <Panel
      className='organization-finance-panel'
      title='Comisión'
      description={
        finance.commissionRate === null
          ? `Se le cobra la general${general !== null ? `, ${general}%` : ''}. Pacta una distinta si se negoció con este proveedor.`
          : `Pactada en ${finance.commissionRate}%. Vale para sus pedidos nuevos.`
      }
      footer={
        editable && (
          <>
            {finance.commissionRate !== null && (
              <button
                type='button'
                className='btn btn-outline-secondary btn-sm'
                disabled={isLoading}
                onClick={() => guardar(null)}
              >
                Volver a la general
              </button>
            )}
            <button
              type='button'
              className='btn btn-primary btn-sm'
              disabled={isLoading || rate === actual || rate === ''}
              onClick={() => guardar(Number(rate))}
            >
              {isLoading ? 'Guardando...' : 'Guardar comisión'}
            </button>
          </>
        )
      }
    >
      {editable && (
        <div className='form-grid'>
          <div>
            <label className='form-label' htmlFor='comision-pactada'>
              Comisión pactada (%)
            </label>
            <input
              id='comision-pactada'
              type='number'
              min={0}
              max={50}
              step={0.5}
              className='form-control'
              placeholder={general !== null ? `La general: ${general}%` : ''}
              value={rate}
              onChange={(event) => setRate(event.target.value)}
            />
            <small className='font-light'>Sobre el total con IVA de cada pedido.</small>
          </div>
        </div>
      )}
      <OrganizationChanges changes={finance.changes} />
    </Panel>
  );
};

export default SupplierCommissionPanel;
