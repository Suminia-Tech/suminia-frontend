import type { ReactNode } from 'react';

/* Los pedidos van fuera de "Mi cuenta", con su propia entrada en la barra de
   la tienda: es a lo que vuelve el comprador, y lo demas de la cuenta son
   ajustes que se tocan una vez. Por eso no llevan el menu lateral de la
   cuenta, solo la seccion de pagina. */
const OrdersLayout = ({ children }: { children: ReactNode }) => (
  <section className='section-b-space'>
    <div className='container-fluid-lg'>{children}</div>
  </section>
);

export default OrdersLayout;
