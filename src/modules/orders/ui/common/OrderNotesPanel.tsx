'use client';

import { useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDateTime } from '@/shared/lib/dates';
import { Panel } from '@/shared/ui';

import { useAddOrderNoteMutation } from '../../api/ordersApi';
import type { Order } from '../../model/order.types';
import type { OrderSide } from './OrdersListScreen';

/* Las observaciones del pedido: lo que pasa con el despues de la venta y no
   es un cambio de estado —una devolucion, una nota credito, un reporte de
   calidad—. Sin esto quedaba en un correo o en la memoria de alguien.

   Las escriben el comprador y el proveedor, cada uno las suyas: ninguno ve
   las del otro, porque no se conocen. El equipo de Suminia las lee todas,
   marcadas por lado, y no escribe: es el que recibe. Se agregan y no se
   editan, como el historial: cada una lleva quien la escribio y cuando, y
   la mas reciente va arriba. */
const DESCRIPCION: Record<OrderSide, string> = {
  buyer:
    'Devoluciones, notas crédito, reportes de calidad y demás novedades de este pedido.',
  supplier:
    'Devoluciones, notas crédito, reportes de calidad y demás novedades de esta orden de compra.',
  staff:
    'Lo que han reportado el comprador y el proveedor sobre este pedido. Cada uno ve solo lo suyo.',
};

const OrderNotesPanel = ({
  order,
  side,
}: {
  order: Pick<Order, 'id' | 'notes'>;
  side: OrderSide;
}) => {
  /* Un backend anterior no manda el campo: pasa durante un despliegue, si
     el frontend llega antes. */
  const notas = order.notes ?? [];
  const [texto, setTexto] = useState('');
  const [agregar, { isLoading }] = useAddOrderNoteMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = texto.trim();
    if (!body) return;
    try {
      await agregar({ id: order.id, body }).unwrap();
      setTexto('');
      toast.success('Observación agregada');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo agregar la observación.'));
    }
  };

  return (
    <Panel
      title={side === 'supplier' ? 'Observaciones de la orden de compra' : 'Observaciones del pedido'}
      description={DESCRIPCION[side]}
    >
      {notas.length > 0 && (
        <ol className='order-history order-notes'>
          {[...notas].reverse().map((nota) => (
            <li key={nota.id}>
              <span className='order-history-dot' />
              <div>
                <p className='mb-0'>{nota.body}</p>
                <small className='font-light'>
                  {formatDateTime(nota.createdAt)} · {nota.authorName}
                  {/* Al equipo se le dice de que lado viene cada una. */}
                  {side === 'staff' &&
                    (nota.authorSide === 'supplier' ? ' (proveedor)' : ' (comprador)')}
                </small>
              </div>
            </li>
          ))}
        </ol>
      )}

      {side === 'staff' ? (
        notas.length === 0 && (
          <p className='font-light mb-0'>Todavía no hay observaciones.</p>
        )
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <label className='form-label' htmlFor='observacion-nueva'>
            Nueva observación
          </label>
          <textarea
            id='observacion-nueva'
            className='form-control'
            rows={3}
            maxLength={1000}
            placeholder={
              side === 'supplier'
                ? 'Ej. Se emitió la nota crédito NC-118 por 2 cajas devueltas.'
                : 'Ej. Devolvimos 2 cajas porque llegaron con el sello roto.'
            }
            value={texto}
            onChange={(event) => setTexto(event.target.value)}
          />
          <div className='d-flex gap-2 mt-3'>
            <button
              type='submit'
              className='btn btn-primary btn-sm'
              disabled={isLoading || !texto.trim()}
            >
              Agregar observación
            </button>
          </div>
        </form>
      )}
    </Panel>
  );
};

export default OrderNotesPanel;
