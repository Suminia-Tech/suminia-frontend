'use client';

import { useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { todayInColombia } from '@/shared/lib/dates';
import { Panel } from '@/shared/ui';

import { useProposeAvailabilityMutation } from '../../api/ordersApi';
import type { Order } from '../../model/order.types';

interface SupplierAvailabilityFormProps {
  order: Order;
  onClose: () => void;
}

/* Lo que hace el proveedor cuando no tiene todo, en vez de rechazar: dice
   cuanto tiene de cada producto y para cuando llega el resto. El comprador
   decide despues si se lleva lo que hay y deja pendiente lo demas.

   Arranca con todo disponible: lo normal es que falte uno o dos productos, y
   asi solo se tocan esos. */
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
        `De "${invalida.item.productName}" puedes ofrecer entre 0 y ${invalida.item.quantity} unidades.`,
      );
      return;
    }
    if (!faltaAlgo) {
      setError('Tienes todo lo que te pidieron: confirma el pedido en vez de proponer.');
      return;
    }
    if (!restockDate) {
      setError('Indica para cuándo tendrás lo que falta.');
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
      toast.success('Le enviamos tu disponibilidad al comprador');
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err, 'No se pudo enviar la disponibilidad.'));
    }
  };

  return (
    <Panel
      title='Informar disponibilidad'
      description='Indica cuántas unidades tienes de cada producto y para cuándo llega el resto. El comprador decide si recibe ahora lo disponible y deja pendiente lo que falta.'
    >
      <form onSubmit={handleSubmit} noValidate>
        <ul className='availability-lines'>
          <li className='availability-head'>
            <span>Producto</span>
            <span>Pedido</span>
            <span>Disponible</span>
          </li>
          {order.items.map((item) => (
            <li key={item.id}>
              <span className='order-item-name'>
                {item.productName}
                <small className='font-light'>
                  {item.presentationName} · {item.packaging}
                </small>
              </span>
              <span>{item.quantity}</span>
              <span>
                <input
                  type='number'
                  min={0}
                  max={item.quantity}
                  className='form-control'
                  aria-label={`Unidades disponibles de ${item.productName}`}
                  value={available[item.id]}
                  onChange={(event) =>
                    setAvailable((current) => ({ ...current, [item.id]: event.target.value }))
                  }
                />
              </span>
            </li>
          ))}
        </ul>

        <div className='form-grid mt-3'>
          <div>
            <label className='form-label' htmlFor='disponibilidad-fecha'>
              Fecha del nuevo inventario
            </label>
            <input
              id='disponibilidad-fecha'
              type='date'
              className='form-control'
              min={todayInColombia()}
              value={restockDate}
              onChange={(event) => setRestockDate(event.target.value)}
            />
            <small className='font-light'>Para cuándo puedes despachar lo que falta.</small>
          </div>
          <div>
            <label className='form-label' htmlFor='disponibilidad-nota'>
              Nota para el comprador (opcional)
            </label>
            <input
              id='disponibilidad-nota'
              type='text'
              className='form-control'
              maxLength={500}
              placeholder='Llega un contenedor el 18'
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
        </div>

        {error && <div className='alert alert-danger mt-3 mb-0'>{error}</div>}

        <div className='d-flex gap-2 mt-3'>
          <button type='submit' className='btn btn-primary btn-sm' disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar al comprador'}
          </button>
          <button
            type='button'
            className='btn btn-outline-secondary btn-sm'
            disabled={isLoading}
            onClick={onClose}
          >
            Mejor no
          </button>
        </div>
      </form>
    </Panel>
  );
};

export default SupplierAvailabilityForm;
