'use client';

import { useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { todayInColombia } from '@/shared/lib/dates';
import { presentationLabel } from '@/shared/lib/presentation';

import { useProposeAvailabilityMutation } from '../../api/ordersApi';
import type { Order } from '../../model/order.types';

interface SupplierAvailabilityFormProps {
  order: Order;
  onClose: () => void;
}

/* Lo que falta de un producto: lo pedido menos lo disponible, nunca menos de
   cero. Mientras el campo no sea un numero valido, todo falta. */
const faltanteDe = (pedida: number, disponible: string): number => {
  const valor = Number(disponible);
  if (disponible.trim() === '' || !Number.isFinite(valor)) return pedida;
  return Math.max(0, pedida - Math.min(Math.max(0, Math.trunc(valor)), pedida));
};

/* La novedad "Disponibilidad parcial": el proveedor dice cuanto tiene de cada
   producto y para cuando tendra el resto. Va dentro del panel de la novedad,
   en el mismo lugar donde eligio el motivo, y no en otra parte de la pantalla.

   Producto por producto, como un bloque: lo solicitado, el campo de lo
   disponible y, debajo, lo que falta, que se calcula solo. Arranca con todo
   disponible: lo normal es que falte uno o dos productos, y asi solo se tocan
   esos. */
const SupplierAvailabilityForm = ({ order, onClose }: SupplierAvailabilityFormProps) => {
  const [available, setAvailable] = useState<Record<string, string>>(() =>
    Object.fromEntries(order.items.map((item) => [item.id, String(item.quantity)])),
  );
  const [restockDate, setRestockDate] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [propose, { isLoading }] = useProposeAvailabilityMutation();

  const cantidades = order.items.map((item) => ({
    item,
    value: Number(available[item.id]),
  }));
  const faltaAlgo = cantidades.some(({ item, value }) => value < item.quantity);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const invalida = cantidades.find(
      ({ item, value }) =>
        available[item.id].trim() === '' ||
        !Number.isInteger(value) ||
        value < 0 ||
        value > item.quantity,
    );
    if (invalida) {
      setError(
        `La cantidad disponible de "${invalida.item.productName}" debe estar entre 0 y ${invalida.item.quantity}.`,
      );
      return;
    }
    if (!faltaAlgo) {
      setError('Tienes disponible todo lo solicitado. En ese caso, confirma la orden.');
      return;
    }
    if (!restockDate) {
      setError('Indica la fecha en que tendrás el faltante.');
      return;
    }

    try {
      await propose({
        id: order.id,
        items: cantidades.map(({ item, value }) => ({
          itemId: item.id,
          availableQuantity: value,
        })),
        restockDate,
        note: note.trim() || undefined,
      }).unwrap();
      toast.success('Novedad enviada a Suminia');
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err, 'No se pudo enviar la novedad.'));
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h6 className='availability-title'>Información de los productos</h6>
      <ul className='availability-items'>
        {order.items.map((item) => {
          const faltante = faltanteDe(item.quantity, available[item.id]);
          return (
            <li key={item.id}>
              <div className='availability-item-info'>
                <strong>{item.productName}</strong>
                <span className='font-light'>
                  {presentationLabel(item.presentationName, item.packaging)} · Cantidad
                  solicitada: {item.quantity}
                </span>
              </div>
              <div className='availability-item-field'>
                <label className='form-label' htmlFor={`disponible-${item.id}`}>
                  Cantidad disponible
                </label>
                <input
                  id={`disponible-${item.id}`}
                  type='number'
                  min={0}
                  max={item.quantity}
                  className='form-control'
                  value={available[item.id]}
                  onChange={(event) =>
                    setAvailable((current) => ({ ...current, [item.id]: event.target.value }))
                  }
                />
                <small className={faltante > 0 ? 'availability-missing' : 'font-light'}>
                  Cantidad faltante: {faltante}
                </small>
              </div>
            </li>
          );
        })}
      </ul>

      <div className='form-grid mt-3'>
        <div>
          <label className='form-label' htmlFor='disponibilidad-fecha'>
            Fecha en que tendrás el faltante
          </label>
          <input
            id='disponibilidad-fecha'
            type='date'
            className='form-control'
            min={todayInColombia()}
            value={restockDate}
            onChange={(event) => setRestockDate(event.target.value)}
          />
        </div>
        <div>
          <label className='form-label' htmlFor='disponibilidad-nota'>
            Detalle (opcional)
          </label>
          <input
            id='disponibilidad-nota'
            type='text'
            className='form-control'
            maxLength={500}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </div>
      </div>

      <small className='font-light d-block mt-2'>
        Esta información es visible únicamente para Suminia, que define si se despacha
        ahora lo disponible y el faltante en una segunda entrega.
      </small>

      {error && <div className='alert alert-danger mt-3 mb-0'>{error}</div>}

      <div className='d-flex gap-2 mt-3'>
        <button type='submit' className='btn btn-primary btn-sm' disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar novedad'}
        </button>
        <button
          type='button'
          className='btn btn-outline-secondary btn-sm'
          disabled={isLoading}
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default SupplierAvailabilityForm;
