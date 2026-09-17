'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ComponentType } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { LoadingOverlay } from '@/shared/ui';

import { usePlaceOrdersMutation } from '../api/ordersApi';

/* Confirmar el pedido.

   Lo que se confirma y a donde va lo ponen otros modulos —el carrito y las
   sedes— y entran como componentes desde la pagina: un modulo nunca importa
   otro, y la pagina si los ve a los dos.

   El cuerpo que se manda es minimo: la sede y una nota. Lo que se pide sale del
   carrito, que el servidor lee por su cuenta. Mandarle las lineas desde aqui
   seria dejarle al navegador decir que precio pago. */

interface CheckoutScreenProps {
  Summary: ComponentType;
  LocationPicker: ComponentType<{
    value: string;
    onChange: (locationId: string) => void;
  }>;
}

export const CheckoutScreen = ({
  Summary,
  LocationPicker,
}: CheckoutScreenProps) => {
  const router = useRouter();
  const [placeOrders, { isLoading }] = usePlaceOrdersMutation();
  const [locationId, setLocationId] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const confirmar = async () => {
    setError(null);

    try {
      const respuesta = await placeOrders({
        ...(locationId ? { deliveryLocationId: locationId } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      }).unwrap();

      const pedidos = respuesta.data;
      toast.success(
        pedidos.length === 1
          ? `Pedido #${pedidos[0].number} enviado a ${pedidos[0].supplierOrganizationName}`
          : `${pedidos.length} pedidos enviados, uno a cada proveedor`,
      );

      /* A la ficha si es uno solo, y al listado si son varios: con uno hay algo
         concreto que mirar, con varios lo util es verlos juntos. */
      router.push(
        pedidos.length === 1
          ? `/buyer/account/orders/${pedidos[0].id}`
          : '/buyer/account/orders',
      );
    } catch (err) {
      /* En el recuadro y no solo en un aviso flotante: aqui el motivo importa
         —un minimo sin alcanzar, algo que se agoto— y hay que poder releerlo. */
      setError(extractErrorMessage(err, 'No se pudo confirmar el pedido.'));
    }
  };

  return (
    <>
      <LoadingOverlay isOpen={isLoading} />

      <div className='checkout-layout'>
        <div>
          <div className='box-head'>
            <h3>¿A dónde lo llevamos?</h3>
          </div>
          <LocationPicker value={locationId} onChange={setLocationId} />

          <div className='box-head mt-4'>
            <h3>¿Algo que el proveedor deba saber?</h3>
          </div>
          <textarea
            className='form-control'
            rows={3}
            maxLength={1000}
            placeholder='Número de orden de compra, urgencia, instrucciones de entrega...'
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          <small className='font-light'>Opcional.</small>
        </div>

        <aside className='checkout-side'>
          <div className='box-head'>
            <h3>Tu pedido</h3>
          </div>

          <Summary />

          {error && <div className='alert alert-danger mt-3'>{error}</div>}

          {/* Se avisa antes y no despues: quien llega aqui con tres proveedores
              esta haciendo tres pedidos, y enterarse al confirmar sorprende. */}
          <p className='checkout-note font-light'>
            Cada proveedor recibe su propio pedido y lo despacha por su cuenta.
          </p>

          <button
            type='button'
            className='btn btn-primary btn-full'
            disabled={isLoading || !locationId}
            onClick={confirmar}
          >
            {isLoading ? 'Confirmando...' : 'Confirmar pedido'}
          </button>

          <Link href='/cart' className='checkout-back font-light'>
            Volver al carrito
          </Link>
        </aside>
      </div>
    </>
  );
};

export default CheckoutScreen;
