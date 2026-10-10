'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDay } from '@/shared/lib/dates';
import { Panel } from '@/shared/ui';

import { useAcceptAvailabilityMutation } from '../../api/ordersApi';
import type { Order, OrderItem } from '../../model/order.types';

interface BuyerAvailabilityResponseProps {
  order: Order;
  pesos: (valor: number, moneda: string) => string;
}

const disponible = (item: OrderItem) => item.availableQuantity ?? item.quantity;
const faltante = (item: OrderItem) => item.quantity - disponible(item);

/* El precio con IVA de unas unidades, al precio que se grabo. El backend hace
   la misma cuenta al aceptar; aqui es solo para que el comprador vea lo que va
   a pagar antes de decidir. */
const conIva = (item: OrderItem, unidades: number) => {
  const subtotal = Math.round(item.unitPrice * unidades);
  return subtotal + Math.round(subtotal * item.taxRate);
};

/* La respuesta del comprador a un despacho parcial. Por cada producto decide
   cuanto recibe ya —hasta lo que el proveedor tiene— y cuanto deja pendiente
   —hasta lo que falta—. Puede bajar cantidades, nunca subirlas: subir pediria
   otra vez disponibilidad al proveedor.

   Lo pendiente sale como un pedido aparte, con la fecha que prometio el
   proveedor, y se paga cuando se despache. Para no aceptar nada, cancela el
   pedido desde el panel de al lado. */
const BuyerAvailabilityResponse = ({ order, pesos }: BuyerAvailabilityResponseProps) => {
  const [ahora, setAhora] = useState<Record<string, string>>(() =>
    Object.fromEntries(order.items.map((item) => [item.id, String(disponible(item))])),
  );
  const [pendiente, setPendiente] = useState<Record<string, string>>(() =>
    Object.fromEntries(order.items.map((item) => [item.id, String(faltante(item))])),
  );
  const [error, setError] = useState<string | null>(null);
  const [accept, { isLoading }] = useAcceptAvailabilityMutation();

  const lineas = order.items.map((item) => ({
    item,
    ahora: Number(ahora[item.id]),
    pendiente: Number(pendiente[item.id]),
  }));

  const validas = lineas.every(
    (l) =>
      Number.isInteger(l.ahora) &&
      Number.isInteger(l.pendiente) &&
      l.ahora >= 0 &&
      l.pendiente >= 0 &&
      l.ahora <= disponible(l.item) &&
      l.pendiente <= faltante(l.item),
  );
  const totalAhora = validas ? lineas.reduce((s, l) => s + conIva(l.item, l.ahora), 0) : null;
  const totalPendiente = validas
    ? lineas.reduce((s, l) => s + conIva(l.item, l.pendiente), 0)
    : null;
  const hayFaltantes = order.items.some((item) => faltante(item) > 0);

  const handleAccept = async () => {
    setError(null);

    const invalida = lineas.find(
      (l) =>
        !Number.isInteger(l.ahora) ||
        l.ahora < 0 ||
        l.ahora > disponible(l.item) ||
        !Number.isInteger(l.pendiente) ||
        l.pendiente < 0 ||
        l.pendiente > faltante(l.item),
    );
    if (invalida) {
      setError(
        `De "${invalida.item.productName}" puedes recibir ahora hasta ${disponible(invalida.item)} y dejar pendientes hasta ${faltante(invalida.item)}.`,
      );
      return;
    }
    if (lineas.every((l) => l.ahora === 0 && l.pendiente === 0)) {
      setError('No queda nada por despachar. Si no lo quieres, cancela el pedido.');
      return;
    }

    try {
      const { data } = await accept({
        id: order.id,
        items: lineas.map((l) => ({
          itemId: l.item.id,
          quantity: l.ahora,
          backorderQuantity: l.pendiente,
        })),
      }).unwrap();
      const pendienteCreado = data.backorders.at(-1);
      toast.success(
        pendienteCreado
          ? `Listo. Lo pendiente quedó en el pedido ${pendienteCreado.code}`
          : 'Listo. El proveedor despachará lo disponible',
      );
    } catch (err) {
      setError(extractErrorMessage(err, 'No se pudo registrar tu respuesta.'));
    }
  };

  return (
    <Panel
      title='Propuesta del proveedor'
      description={
        hayFaltantes && order.restockDate
          ? `No tiene todo lo que pediste. Lo que falta lo tendrá para el ${formatDay(order.restockDate)}.`
          : 'No tiene todo lo que pediste.'
      }
    >
      {order.statusReason && (
        <p className='availability-note'>
          <strong>Nota del proveedor:</strong> {order.statusReason}
        </p>
      )}

      <ul className='availability-lines is-answer'>
        <li className='availability-head'>
          <span>Producto</span>
          <span>Pediste</span>
          <span>Recibir ahora</span>
          <span>Dejar pendiente</span>
        </li>
        {lineas.map(({ item }) => (
          <li key={item.id}>
            <span className='order-item-name'>
              {item.productName}
              <small className='font-light'>
                {item.presentationName} · disponibles {disponible(item)}
              </small>
            </span>
            <span>{item.quantity}</span>
            <span>
              <input
                type='number'
                min={0}
                max={disponible(item)}
                className='form-control'
                aria-label={`Recibir ahora de ${item.productName}`}
                value={ahora[item.id]}
                onChange={(event) =>
                  setAhora((current) => ({ ...current, [item.id]: event.target.value }))
                }
              />
            </span>
            <span>
              {faltante(item) > 0 ? (
                <input
                  type='number'
                  min={0}
                  max={faltante(item)}
                  className='form-control'
                  aria-label={`Dejar pendiente de ${item.productName}`}
                  value={pendiente[item.id]}
                  onChange={(event) =>
                    setPendiente((current) => ({ ...current, [item.id]: event.target.value }))
                  }
                />
              ) : (
                <span className='font-light'>—</span>
              )}
            </span>
          </li>
        ))}
      </ul>

      <ul className='cart-summary-lines order-totals'>
        <li>
          <span className='font-light'>Se despacha ahora</span>
          <span>{totalAhora === null ? '—' : pesos(totalAhora, order.currency)}</span>
        </li>
        {hayFaltantes && (
          <li>
            <span className='font-light'>
              Queda pendiente
              {order.restockDate && ` (para el ${formatDay(order.restockDate)})`}
            </span>
            <span>{totalPendiente === null ? '—' : pesos(totalPendiente, order.currency)}</span>
          </li>
        )}
      </ul>
      <p className='font-light order-payout-note'>
        Lo pendiente sale como un pedido aparte y se despacha cuando el proveedor tenga el
        inventario. Precios con IVA, al valor de tu pedido original.
      </p>

      {error && <div className='alert alert-danger mt-3 mb-0'>{error}</div>}

      <div className='d-flex gap-2 mt-3'>
        <button
          type='button'
          className='btn btn-primary btn-sm'
          disabled={isLoading}
          onClick={handleAccept}
        >
          {isLoading ? 'Enviando...' : 'Aceptar'}
        </button>
      </div>
    </Panel>
  );
};

export default BuyerAvailabilityResponse;
