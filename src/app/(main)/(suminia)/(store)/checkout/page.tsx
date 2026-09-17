import type { Metadata } from 'next';

import { CartSummary } from '@/modules/cart';
import { DeliveryLocationPicker } from '@/modules/organizations';
import { CheckoutScreen } from '@/modules/orders';

export const metadata: Metadata = {
  title: 'Confirmar pedido',
  description: 'Revisa lo que vas a pedir y a dónde llega.',
};

/* La pagina junta los tres modulos: el carrito pone lo que se pide,
   organizations las sedes y orders la confirmacion. Ninguno se importa a los
   otros —la regla de frontera no lo permite— y aqui, que los ve a los tres, no
   hace falta. */
export default function CheckoutPage() {
  return (
    <section className='section-b-space'>
      <div className='container-fluid-lg'>
        <div className='box-head'>
          <h3>Confirmar pedido</h3>
        </div>
        <CheckoutScreen
          Summary={CartSummary}
          LocationPicker={DeliveryLocationPicker}
        />
      </div>
    </section>
  );
}
