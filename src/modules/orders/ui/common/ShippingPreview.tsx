'use client';

import { useGetOrderPreviewQuery } from '../../api/ordersApi';

/* El envio del pedido, en el checkout. Lo fija cada proveedor y depende de la
   ciudad de la sede, de modo que se calcula con la que este elegida. Se dice
   tambien cuanto falta para el envio gratis: es lo que hace que alguien
   agregue una caja mas. */

const pesos = (valor: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);

export const ShippingPreview = ({ locationId }: { locationId: string }) => {
  const { data, isFetching, isError } = useGetOrderPreviewQuery(locationId, {
    skip: !locationId,
  });
  const preview = data?.data;

  /* Si el carrito no se puede pedir —un minimo sin alcanzar—, el error ya lo
     dice el carrito; aqui no se repite. */
  if (!locationId || isError || !preview) return null;

  return (
    <ul className={`cart-summary-lines shipping-preview${isFetching ? ' is-loading' : ''}`}>
      {preview.suppliers.map((proveedor) => (
        <li key={proveedor.supplierOrganizationId}>
          <span className='font-light'>
            Envío {preview.suppliers.length > 1 ? proveedor.supplierName : ''}
            {proveedor.missingForFreeShipping !== null && (
              <small className='d-block'>
                Te faltan {pesos(proveedor.missingForFreeShipping)} + IVA para envío gratis
              </small>
            )}
          </span>
          <span>{proveedor.shippingCost > 0 ? pesos(proveedor.shippingCost) : 'Gratis'}</span>
        </li>
      ))}
      <li className='cart-summary-total'>
        <span>Total a pagar</span>
        <strong>{pesos(preview.total)}</strong>
      </li>
    </ul>
  );
};

export default ShippingPreview;
