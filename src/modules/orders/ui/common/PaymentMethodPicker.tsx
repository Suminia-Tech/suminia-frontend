'use client';

import { formatDay } from '@/shared/lib/dates';

import { useGetMyCreditQuery } from '../../api/ordersApi';
import type { PaymentMethod } from '../../model/order.types';

/* Como paga el comprador: por transferencia, o a credito si Suminia se lo dio.

   Sin credito no hay nada que elegir y no se pinta: el pedido va por
   transferencia. Con credito se dice el cupo que queda, y si no alcanza o hay
   algo vencido, la opcion se apaga con el motivo en vez de dejar que el
   pedido falle al confirmar.

   Las mismas tarjetas que la eleccion de sede: un mismo tipo de control se ve
   igual en toda la app. */

const pesos = (valor: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);

interface PaymentMethodPickerProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  /** Lo que se va a pedir, para saber si cabe en el cupo. */
  total: number | null;
}

export const PaymentMethodPicker = ({ value, onChange, total }: PaymentMethodPickerProps) => {
  const { data } = useGetMyCreditQuery();
  const credito = data?.data;

  if (!credito?.enabled) {
    return (
      <p className='font-light'>
        Pagas por transferencia a Suminia cuando el proveedor confirme el pedido.
      </p>
    );
  }

  const motivo =
    credito.overdueOrders > 0
      ? `Tienes pagos vencidos${credito.oldestDueAt ? ` desde el ${formatDay(credito.oldestDueAt)}` : ''}: ponte al día para volver a pedir a crédito.`
      : total !== null && total > credito.available
        ? `El pedido supera tu cupo disponible de ${pesos(credito.available)}.`
        : null;

  return (
    <ul className='location-choices'>
      <li>
        <label className={value === 'TRANSFER' ? 'is-chosen' : undefined}>
          <input
            type='radio'
            name='paymentMethod'
            checked={value === 'TRANSFER'}
            onChange={() => onChange('TRANSFER')}
          />
          <span>
            <strong>Transferencia</strong>
            <small className='font-light'>
              Pagas a Suminia cuando el proveedor confirme, antes del despacho.
            </small>
          </span>
        </label>
      </li>
      <li>
        <label className={value === 'CREDIT' ? 'is-chosen' : undefined}>
          <input
            type='radio'
            name='paymentMethod'
            checked={value === 'CREDIT'}
            disabled={Boolean(motivo)}
            onChange={() => onChange('CREDIT')}
          />
          <span>
            <strong>A crédito, {credito.days} días</strong>
            <small className='font-light'>
              {motivo ??
                `Pagas después de la entrega. Te quedan ${pesos(credito.available)} de cupo.`}
            </small>
          </span>
        </label>
      </li>
    </ul>
  );
};

export default PaymentMethodPicker;
