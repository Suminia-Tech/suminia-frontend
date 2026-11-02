import { formatDateTime } from '@/shared/lib/dates';
import { Panel } from '@/shared/ui';

import { ORDER_EVENT_LABEL } from '../../lib/orderStatus';
import type { Order, OrderEvent } from '../../model/order.types';

/* El historial del pedido: quien hizo cada paso y cuando, el mas reciente
   arriba. Es la auditoria cuando hay un reclamo —"¿quien lo cancelo?",
   "¿cuando se verifico el pago?"— y por eso dice el nombre de la persona y no
   solo la empresa. */

const QUIEN: Record<OrderEvent['actorSide'], string> = {
  buyer: 'comprador',
  supplier: 'proveedor',
  staff: 'Suminia',
  system: 'Suminia',
};

export const OrderHistoryPanel = ({ order }: { order: Order }) => {
  if (order.events.length === 0) return null;

  return (
    <Panel title='Historial'>
      <ol className='order-history'>
        {[...order.events].reverse().map((event) => (
          <li key={event.id}>
            <span className='order-history-dot' />
            <div>
              <strong>{ORDER_EVENT_LABEL[event.type]}</strong>
              <small className='font-light'>
                {formatDateTime(event.createdAt)}
                {event.actorSide === 'system'
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
