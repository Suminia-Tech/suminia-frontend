import { formatDateTime } from '@/shared/lib/dates';
import { Panel } from '@/shared/ui';

import { BUYER_EVENT_LABEL, ORDER_EVENT_LABEL } from '../../lib/orderStatus';
import type { Order, OrderEvent } from '../../model/order.types';
import type { OrderSide } from './OrdersListScreen';

/* El historial del pedido: quien hizo cada paso y cuando, el mas reciente
   arriba. Es la auditoria cuando hay un reclamo —"¿quien lo cancelo?",
   "¿cuando se verifico el pago?"— y por eso dice el nombre de la persona y no
   solo la empresa.

   El comprador lo ve distinto: su relacion es con Suminia, no con el
   proveedor. Lo que hizo el proveedor lo firma Suminia, los pasos se dicen
   como los cuatro de su pedido, y lo que es solo entre Suminia y el
   proveedor —su factura, la liquidacion— no aparece. */

const QUIEN: Record<OrderEvent['actorSide'], string> = {
  buyer: 'comprador',
  supplier: 'proveedor',
  staff: 'Suminia',
  system: 'Suminia',
};

/* Quien firma un paso, dicho al comprador: el, o Suminia. */
const firmaComprador = (event: OrderEvent): string =>
  event.actorSide === 'buyer' && event.actorName ? ` · ${event.actorName}` : ' · Suminia';

export const OrderHistoryPanel = ({ order, side }: { order: Order; side: OrderSide }) => {
  const esComprador = side === 'buyer';
  const eventos = esComprador
    ? order.events.filter((event) => BUYER_EVENT_LABEL[event.type] !== null)
    : order.events;
  if (eventos.length === 0) return null;

  return (
    <Panel title='Historial'>
      <ol className='order-history'>
        {[...eventos].reverse().map((event) => (
          <li key={event.id}>
            <span className='order-history-dot' />
            <div>
              <strong>
                {esComprador ? BUYER_EVENT_LABEL[event.type] : ORDER_EVENT_LABEL[event.type]}
              </strong>
              <small className='font-light'>
                {formatDateTime(event.createdAt)}
                {esComprador
                  ? firmaComprador(event)
                  : event.actorSide === 'system'
                    ? ' · automático'
                    : event.actorName
                      ? ` · ${event.actorName} (${QUIEN[event.actorSide]})`
                      : ''}
              </small>
              {event.note && <p className='font-light mb-0'>{event.note}</p>}
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
};

export default OrderHistoryPanel;
