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
      toast.success(valor === null ? 'Vuelve al incremento de cada línea' : 'Incremento pactado guardado');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo guardar el incremento.'));
    }
  };

  return (
    <Panel
      className='organization-finance-panel'
      title='Incremento pactado'
      description={
        finance.commissionRate === null
          ? 'Sus productos se venden con el incremento de su línea comercial. Pacta uno distinto si se negoció con este proveedor: vale para todo su catálogo.'
          : `Pactado en ${String(finance.commissionRate).replace('.', ',')}% para todo su catálogo, en vez del de cada línea. El precio cambia al instante; los pedidos hechos conservan el suyo.`
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
                Volver al de cada línea
              </button>
            )}
            <button
              type='button'
              className='btn btn-primary btn-sm'
              disabled={isLoading || rate === actual || rate === ''}
              onClick={() => guardar(Number(rate))}
            >
              {isLoading ? 'Guardando...' : 'Guardar incremento'}
            </button>
          </>
        )
      }
    >
      {editable && (
        <div className='form-grid'>
          <div>
            <label className='form-label' htmlFor='comision-pactada'>
              Incremento pactado (%)
            </label>
            <input
              id='comision-pactada'
              type='number'
              min={0}
              max={50}
              step={0.5}
              className='form-control'
              placeholder='El de cada línea'
              value={rate}
              onChange={(event) => setRate(event.target.value)}
            />
            <small className='font-light'>Sobre su precio, antes de IVA.</small>
          </div>
        </div>
      )}
      <OrganizationChanges changes={finance.changes} />
    </Panel>
  );
};

export default SupplierCommissionPanel;
