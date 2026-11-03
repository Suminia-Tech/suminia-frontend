'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/dates';
import { hasPermission } from '@/shared/lib/permissions';
import { PageHeader, PageSkeleton, Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import {
  useGetFinanceChangesQuery,
  useGetFinanceSettingsQuery,
  useGetNegotiatedCommissionsQuery,
  useUpdateFinanceSettingsMutation,
} from '../../api/financeApi';
import { formatChangeValue, formatPercent, WEEKDAY_LABEL } from '../../lib/format';
import CommercialLinesPanel from './CommercialLinesPanel';
import PlanPanel from './PlanPanel';
import type { PlatformSettings, PlatformSettingsUpdate } from '../../model/finance.types';

/* Las reglas del dinero, en manos de finanzas.

   Todo lo que puede cambiar con el tiempo esta aqui y no en el codigo: el
   incremento de cada linea comercial, los supuestos y metas del plan
   financiero, los plazos, la cuenta donde se recibe. Lo que se cambia vale para
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

  if (!hydrated || isLoading) return <PageSkeleton variant='form' />;
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
        description='Los incrementos sobre el costo, los supuestos y metas del plan financiero, los plazos y la cuenta donde se reciben los pagos. Los precios cambian al instante en el catálogo; los pedidos ya hechos conservan los suyos.'
      />
      {/* La clave reinicia el formulario cuando cambia lo guardado: se
          inicializa una vez con lo que hay, sin copiarlo en un efecto. */}
      <CommercialLinesPanel editable={editable} general={data.data.commissionRate}>
        <NegotiatedCommissions />
      </CommercialLinesPanel>
      <SettingsForm key={data.data.updatedAt} settings={data.data} editable={editable} />
      <PlanPanel editable={editable} />
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
  'freightRate',
  'collectionRate',
  'returnsRate',
  'badDebtRate',
  'otherVariableRate',
  'monthlyFixedCosts',
  'cashFloor',
  'creditPortfolioCap',
  'targetTicket',
  'targetFrequency',
  'targetQuoteConversion',
];

const aCampos = (s: PlatformSettings): Campos => ({
  commissionRate: String(s.commissionRate),
  paymentWindowHours: String(s.paymentWindowHours),
  paymentReminderHours: String(s.paymentReminderHours),
  claimWindowDays: String(s.claimWindowDays),
  payoutWeekday: String(s.payoutWeekday),
  quoteValidityDays: String(s.quoteValidityDays),
  freightRate: String(s.freightRate),
  collectionRate: String(s.collectionRate),
  returnsRate: String(s.returnsRate),
  badDebtRate: String(s.badDebtRate),
  otherVariableRate: String(s.otherVariableRate),
  monthlyFixedCosts: String(s.monthlyFixedCosts),
  cashFloor: String(s.cashFloor),
  creditPortfolioCap: String(s.creditPortfolioCap),
  targetTicket: String(s.targetTicket),
  targetFrequency: String(s.targetFrequency),
  targetQuoteConversion: String(s.targetQuoteConversion),
  bankName: s.bankName ?? '',
  accountType: s.accountType ?? '',
  accountNumber: s.accountNumber ?? '',
  accountHolder: s.accountHolder ?? '',
  accountHolderTaxId: s.accountHolderTaxId ?? '',
  breBKey: s.breBKey ?? '',
  paymentInstructions: s.paymentInstructions ?? '',
  staffNotificationEmail: s.staffNotificationEmail ?? '',
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
        title='Supuestos del plan'
        description='Lo que el informe financiero reserva sobre cada venta y lo que cuesta operar. Con esto se calculan el aporte, el resultado y el equilibrio del tablero.'
        footer={footer}
      >
        <div className='form-grid'>
          {numero('freightRate', 'Flete neto (% de ventas)', 'Lo que cuesta llevar el pedido y no se le cobra al comprador.', { min: 0, max: 20, step: 0.1 })}
          {numero('collectionRate', 'Recaudo (% de ventas)', 'Comisiones bancarias y del medio de pago.', { min: 0, max: 20, step: 0.1 })}
          {numero('returnsRate', 'Devoluciones y garantías (% de ventas)', 'Reserva para lo que se devuelve o se repone.', { min: 0, max: 20, step: 0.1 })}
          {numero('badDebtRate', 'Pérdida de cartera (% de ventas)', 'Reserva para el crédito que no se cobre.', { min: 0, max: 20, step: 0.1 })}
          {numero('otherVariableRate', 'Tributos y otros variables (% de ventas)', 'Impuestos operativos y lo demás que crece con la venta.', { min: 0, max: 20, step: 0.1 })}
          {numero('monthlyFixedCosts', 'Gasto fijo mensual ($)', 'Nómina, asesorías, marketing y tecnología de un mes.', { min: 0, max: 10_000_000_000, step: 100000 })}
          {numero('cashFloor', 'Piso de caja ($)', 'La caja que no se toca. Bajo este piso se suspende el crédito nuevo.', { min: 0, max: 100_000_000_000, step: 1000000 })}
          {numero('creditPortfolioCap', 'Tope de cartera a crédito ($)', 'Lo máximo que puede estar prestado entre todas las instituciones.', { min: 0, max: 100_000_000_000, step: 1000000 })}
          {numero('targetTicket', 'Ticket meta por pedido ($)', 'Lo que se espera que pida una institución cada vez.', { min: 0, max: 10_000_000_000, step: 100000 })}
          {numero('targetFrequency', 'Pedidos meta por comprador al mes', 'Cuántas veces al mes compra una institución activa.', { min: 0, max: 100, step: 0.1 })}
          {numero('targetQuoteConversion', 'Conversión meta de cotizaciones (%)', 'De cada 100 cotizaciones, cuántas se vuelven pedido.', { min: 0, max: 100, step: 1 })}
        </div>
      </Panel>

      <Panel
        title='Plazos'
        description={`Actualizado el ${formatDate(settings.updatedAt)}.`}
        footer={footer}
      >
        <div className='form-grid'>
          {numero(
            'paymentWindowHours',
            'Horas para pagar',
            'Desde que se hace el pedido. Vencidas sin pago verificado, el pedido se cancela solo.',
            { min: 1, max: 720 },
          )}
          {numero(
            'paymentReminderHours',
            'Recordatorio de pago (horas)',
            'Cuántas horas después de hecho el pedido se le recuerda al comprador que pague.',
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
          {numero(
            'commissionRate',
            'Incremento general (%)',
            'Sobre el costo, para una línea comercial que no tenga el suyo.',
            { min: 0, max: 50, step: 0.5 },
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

      <Panel
        title='Avisos al equipo'
        description='A dónde le llega por correo a Suminia lo que pide su atención: comprobantes por verificar, documentos por revisar, reclamos.'
        footer={footer}
      >
        <div className='form-grid'>
          <div>
            <label className='form-label' htmlFor='fin-staffNotificationEmail'>
              Correo de avisos
            </label>
            <input
              id='fin-staffNotificationEmail'
              type='email'
              maxLength={255}
              className='form-control'
              disabled={!editable}
              placeholder='equipo@suminia.io'
              value={campos.staffNotificationEmail}
              onChange={(event) => set('staffNotificationEmail')(event.target.value)}
            />
            <small className='font-light'>
              La campana le llega a cada persona del equipo; este es el buzón común. Vacío, no se
              envía correo.
            </small>
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

/* Quien no paga la general. Sin esto, subir la general parece no hacer nada
   con el proveedor que la tiene pactada: el pedido sale con la suya. */
const NegotiatedCommissions = () => {
  const { data } = useGetNegotiatedCommissionsQuery();
  const pactadas = data?.data ?? [];
  if (pactadas.length === 0) return null;

  return (
    <p className='panel-warning mt-3 mb-0'>
      <span>
        {pactadas.length === 1 ? 'Este proveedor tiene' : 'Estos proveedores tienen'} un incremento
        pactado y no cambian con el de su línea:{' '}
        {pactadas.map((p, i) => (
          <span key={p.id}>
            {i > 0 && ', '}
            <Link href={`/admin/suppliers/${p.id}`}>{p.name}</Link> ({formatPercent(p.rate)})
          </span>
        ))}
        . Se quita en la ficha de cada uno.
      </span>
    </p>
  );
};

export default FinanceSettingsScreen;
