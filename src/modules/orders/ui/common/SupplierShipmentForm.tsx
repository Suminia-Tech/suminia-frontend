'use client';

import { useState, type FormEvent } from 'react';
import { Truck } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { todayInColombia } from '@/shared/lib/dates';
import { Panel } from '@/shared/ui';

import { useChangeOrderStatusMutation } from '../../api/ordersApi';
import type { Order } from '../../model/order.types';

/* El despacho de una orden confirmada: con que transportadora sale, su guia
   si la hay, y para cuando se estima la entrega.

   Va en la columna principal, debajo del detalle, y no detras de un boton:
   confirmada la orden, despacharla es lo unico que le queda al proveedor.

   La casilla final no es un tramite: "despachado" es lo que el comprador ve
   como "va en camino", y marcarlo antes de que la mercancia salga le promete
   algo que todavia no paso. */

interface SupplierShipmentFormProps {
  order: Pick<Order, 'id'>;
}

/* El ancla del formulario: el aviso de la columna lateral lleva hasta aqui. */
export const SHIPMENT_FORM_ID = 'informacion-despacho';

/* Como queda registrado el despacho en vehiculo propio. */
const VEHICULO_PROPIO = 'Transporte propio del proveedor';

const SupplierShipmentForm = ({ order }: SupplierShipmentFormProps) => {
  /* Quien lleva la mercancia: una transportadora, con su nombre y su guia, o
     el proveedor en su propio vehiculo, que no tiene ni lo uno ni lo otro. */
  const [quien, setQuien] = useState<'' | 'carrier' | 'own'>('');
  const [carrierName, setCarrierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimada, setEstimada] = useState('');
  const [salio, setSalio] = useState(false);
  const [changeStatus, { isLoading }] = useChangeOrderStatusMutation();

  const propio = quien === 'own';
  const completo =
    quien !== '' && (propio || carrierName.trim() !== '') && estimada !== '' && salio;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!completo) return;
    try {
      await changeStatus({
        id: order.id,
        status: 'SHIPPED',
        estimatedDeliveryAt: estimada,
        carrierName: propio ? VEHICULO_PROPIO : carrierName.trim(),
        trackingNumber: propio ? undefined : trackingNumber.trim() || undefined,
      }).unwrap();
      toast.success('Despacho registrado');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo registrar el despacho.'));
    }
  };

  return (
    <div id={SHIPMENT_FORM_ID} className='scroll-anchor'>
    <Panel
      title='Información del despacho'
      description='Completa estos datos cuando los productos estén preparados y listos para salir del establecimiento.'
    >
      <form onSubmit={handleSubmit} noValidate>
        <fieldset className='form-question mb-3'>
          <legend className='form-label'>¿Quién realizará la entrega?</legend>
          {(
            [
              { value: 'carrier', label: 'Transportadora externa' },
              { value: 'own', label: 'Transporte propio del proveedor' },
            ] as const
          ).map((opcion) => (
            <div className='form-check' key={opcion.value}>
              <input
                id={`despacho-quien-${opcion.value}`}
                type='radio'
                name='despacho-quien'
                className='form-check-input'
                checked={quien === opcion.value}
                onChange={() => setQuien(opcion.value)}
              />
              <label className='form-check-label' htmlFor={`despacho-quien-${opcion.value}`}>
                {opcion.label}
              </label>
            </div>
          ))}
        </fieldset>

        <div className='form-grid'>
          {quien === 'carrier' && (
          <>
          <div>
            <label className='form-label' htmlFor='despacho-transportadora'>
              Nombre de la transportadora
            </label>
            <input
              id='despacho-transportadora'
              type='text'
              className='form-control'
              maxLength={120}
              placeholder='Ej. Coordinadora, Servientrega...'
              value={carrierName}
              onChange={(event) => setCarrierName(event.target.value)}
            />
          </div>
          <div>
            <label className='form-label' htmlFor='despacho-guia'>
              Número de guía (opcional)
            </label>
            <input
              id='despacho-guia'
              type='text'
              className='form-control'
              maxLength={120}
              placeholder='Número de seguimiento'
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
            />
          </div>
          </>
          )}
          <div>
            <label className='form-label' htmlFor='despacho-fecha'>
              Fecha estimada de entrega
            </label>
            <input
              id='despacho-fecha'
              type='date'
              className='form-control'
              min={todayInColombia()}
              value={estimada}
              onChange={(event) => setEstimada(event.target.value)}
            />
          </div>
        </div>

        <div className='form-check mt-3'>
          <input
            id='despacho-salio'
            type='checkbox'
            className='form-check-input'
            checked={salio}
            onChange={(event) => setSalio(event.target.checked)}
          />
          <label className='form-check-label' htmlFor='despacho-salio'>
            Confirmo que los productos fueron entregados a la transportadora o salieron en
            el vehículo de reparto.
          </label>
        </div>

        <div className='d-flex gap-2 mt-3'>
          <button
            type='submit'
            className='btn btn-primary btn-sm btn-with-icon'
            disabled={isLoading || !completo}
          >
            <Truck size={14} />
            {isLoading ? 'Registrando...' : 'Registrar despacho'}
          </button>
        </div>
      </form>
    </Panel>
    </div>
  );
};

export default SupplierShipmentForm;
