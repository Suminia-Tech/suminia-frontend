'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/dates';
import { hasPermission } from '@/shared/lib/permissions';
import { PageHeader, Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import {
  useGetFinanceChangesQuery,
  useGetFinanceSettingsQuery,
  useUpdateFinanceSettingsMutation,
} from '../../api/financeApi';
import { formatChangeValue, WEEKDAY_LABEL } from '../../lib/format';
import type { PlatformSettings, PlatformSettingsUpdate } from '../../model/finance.types';

/* Las reglas del dinero, en manos de finanzas.

   Todo lo que puede cambiar con el tiempo esta aqui y no en el codigo: la
   comision, los plazos, la cuenta donde se recibe. Lo que se cambia vale para
   los pedidos nuevos —cada pedido se graba la comision y los plazos con que
   se hizo—, y cada cambio queda en el historial de abajo con quien lo hizo.

   Quien solo verifica pagos lo ve sin poder cambiarlo. */
export const FinanceSettingsScreen = () => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  const editable = hasPermission(permissions, 'finance:manage');
  const { data, isLoading, isError, error } = useGetFinanceSettingsQuery(undefined, {
    skip: !hydrated,
  });

  if (!hydrated || isLoading) return <p className='font-light'>Cargando...</p>;
  if (isError || !data) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudo cargar la configuración.')}
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title='Configuración financiera'
        description='La comisión, los plazos y la cuenta donde se reciben los pagos. Los cambios valen para los pedidos nuevos.'
      />
      {/* La clave reinicia el formulario cuando cambia lo guardado: se
          inicializa una vez con lo que hay, sin copiarlo en un efecto. */}
      <SettingsForm key={data.data.updatedAt} settings={data.data} editable={editable} />
      {editable && <ChangesPanel />}
    </>
  );
};

type Campos = Record<keyof PlatformSettingsUpdate, string>;

const NUMERICOS: (keyof PlatformSettingsUpdate)[] = [
  'commissionRate',
  'paymentWindowHours',
  'paymentReminderHours',
  'claimWindowDays',
  'payoutWeekday',
  'quoteValidityDays',
];

const aCampos = (s: PlatformSettings): Campos => ({
  commissionRate: String(s.commissionRate),
  paymentWindowHours: String(s.paymentWindowHours),
  paymentReminderHours: String(s.paymentReminderHours),
  claimWindowDays: String(s.claimWindowDays),
  payoutWeekday: String(s.payoutWeekday),
  quoteValidityDays: String(s.quoteValidityDays),
  bankName: s.bankName ?? '',
  accountType: s.accountType ?? '',
  accountNumber: s.accountNumber ?? '',
  accountHolder: s.accountHolder ?? '',
  accountHolderTaxId: s.accountHolderTaxId ?? '',
  breBKey: s.breBKey ?? '',
  paymentInstructions: s.paymentInstructions ?? '',
});

const SettingsForm = ({
  settings,
  editable,
}: {
  settings: PlatformSettings;
  editable: boolean;
}) => {
  const [update, { isLoading }] = useUpdateFinanceSettingsMutation();
  const [campos, setCampos] = useState<Campos>(() => aCampos(settings));
  const original = aCampos(settings);
  const cambiados = (Object.keys(campos) as (keyof Campos)[]).filter(
    (campo) => campos[campo] !== original[campo],
  );

  const set = (campo: keyof Campos) => (valor: string) =>
    setCampos((actual) => ({ ...actual, [campo]: valor }));

  const guardar = async () => {
    const body = Object.fromEntries(
      cambiados.map((campo) => [
        campo,
        NUMERICOS.includes(campo) ? Number(campos[campo]) : campos[campo].trim(),
      ]),
    ) as PlatformSettingsUpdate;
    try {
      await update(body).unwrap();
      toast.success('Configuración guardada');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo guardar.'));
    }
  };

  const footer = editable && (
    <button
      type='button'
      className='btn btn-primary btn-sm'
      disabled={cambiados.length === 0 || isLoading}
      onClick={guardar}
    >
      {isLoading ? 'Guardando...' : 'Guardar cambios'}
    </button>
  );

  const numero = (
    campo: keyof Campos,
    label: string,
    ayuda: string,
    props: { min: number; max: number; step?: number },
  ) => (
    <div>
      <label className='form-label' htmlFor={`fin-${campo}`}>
        {label}
      </label>
      <input
        id={`fin-${campo}`}
        type='number'
        className='form-control'
        disabled={!editable}
        value={campos[campo]}
        onChange={(event) => set(campo)(event.target.value)}
        {...props}
      />
      <small className='font-light'>{ayuda}</small>
    </div>
  );

  const texto = (campo: keyof Campos, label: string, max: number, placeholder = '') => (
    <div>
      <label className='form-label' htmlFor={`fin-${campo}`}>
        {label}
      </label>
      <input
        id={`fin-${campo}`}
        type='text'
        className='form-control'
        maxLength={max}
        disabled={!editable}
        placeholder={placeholder}
        value={campos[campo]}
        onChange={(event) => set(campo)(event.target.value)}
      />
    </div>
  );

  return (
    <>
      <Panel
        title='Comisión y plazos'
        description={`Actualizado el ${formatDate(settings.updatedAt)}.`}
        footer={footer}
      >
        <div className='form-grid'>
          {numero(
            'commissionRate',
            'Comisión general (%)',
            'Sobre el total con IVA. La de cada proveedor se pacta en su ficha y manda sobre esta.',
            { min: 0, max: 50, step: 0.5 },
          )}
          {numero(
            'paymentWindowHours',
            'Horas para pagar',
            'Desde que el proveedor confirma. Vencidas sin comprobante, el pedido se cancela solo.',
            { min: 1, max: 720 },
          )}
          {numero(
            'paymentReminderHours',
            'Recordatorio de pago (horas)',
            'Cuántas horas después de la confirmación se le recuerda al comprador.',
            { min: 1, max: 719 },
          )}
          {numero(
            'claimWindowDays',
            'Días hábiles de reclamo',
            'Después de la entrega, antes de que el pedido entre en una liquidación.',
            { min: 0, max: 60 },
          )}
          <div>
            <label className='form-label' htmlFor='fin-payoutWeekday'>
              Día de liquidación
            </label>
            <select
              id='fin-payoutWeekday'
              className='form-control'
              disabled={!editable}
              value={campos.payoutWeekday}
              onChange={(event) => set('payoutWeekday')(event.target.value)}
            >
              {Object.entries(WEEKDAY_LABEL).map(([valor, nombre]) => (
                <option key={valor} value={valor}>
                  {nombre}
                </option>
              ))}
            </select>
            <small className='font-light'>Cada semana se liquida lo que esté listo ese día.</small>
          </div>
          {numero(
            'quoteValidityDays',
            'Vigencia de las cotizaciones (días)',
            'Mientras esté vigente, una cotización se convierte en pedido a sus precios.',
            { min: 1, max: 90 },
          )}
        </div>
      </Panel>

      <Panel
        title='Cuenta para recibir pagos'
        description='Lo que ven los compradores al pagar y lo que sale en las cotizaciones.'
        footer={footer}
      >
        <div className='form-grid'>
          {texto('bankName', 'Banco', 120, 'Bancolombia')}
          <div>
            <label className='form-label' htmlFor='fin-accountType'>
              Tipo de cuenta
            </label>
            <select
              id='fin-accountType'
              className='form-control'
              disabled={!editable}
              value={campos.accountType}
              onChange={(event) => set('accountType')(event.target.value)}
            >
              <option value=''>Elige una opción</option>
              <option value='AHORROS'>Ahorros</option>
              <option value='CORRIENTE'>Corriente</option>
            </select>
          </div>
          {texto('accountNumber', 'Número de cuenta', 40)}
          {texto('accountHolder', 'Titular', 180, 'Suminia S.A.S.')}
          {texto('accountHolderTaxId', 'NIT del titular', 30)}
          {texto('breBKey', 'Llave Bre-B', 100)}
          <div className='form-grid-full'>
            <label className='form-label' htmlFor='fin-paymentInstructions'>
              Instrucciones para el comprador (opcional)
            </label>
            <textarea
              id='fin-paymentInstructions'
              className='form-control'
              rows={3}
              maxLength={1000}
              disabled={!editable}
              placeholder='Escribe el código del pedido en la descripción de la transferencia.'
              value={campos.paymentInstructions}
              onChange={(event) => set('paymentInstructions')(event.target.value)}
            />
          </div>
        </div>
      </Panel>
    </>
  );
};

/* Quien cambio que y cuando. */
const ChangesPanel = () => {
  const { data } = useGetFinanceChangesQuery();
  const cambios = data?.data ?? [];

  return (
    <Panel title='Historial de cambios' description='Cada cambio a las reglas, con quien lo hizo.'>
      {cambios.length === 0 ? (
        <p className='font-light mb-0'>Todavía no se ha cambiado nada.</p>
      ) : (
        <div className='catalog-table-scroll'>
          <table className='catalog-table'>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Regla</th>
                <th>Antes</th>
                <th>Ahora</th>
                <th>Quién</th>
              </tr>
            </thead>
            <tbody>
              {cambios.map((cambio) => (
                <tr key={cambio.id}>
                  <td>{formatDate(cambio.createdAt)}</td>
                  <td>{cambio.label}</td>
                  <td className='font-light'>{formatChangeValue(cambio.field, cambio.oldValue)}</td>
                  <td>{formatChangeValue(cambio.field, cambio.newValue)}</td>
                  <td>{cambio.userName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
};

export default FinanceSettingsScreen;
