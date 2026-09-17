'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useGetDeliveryLocationsQuery } from '../../api/deliveryLocationsApi';

/* Elegir a donde llega el pedido.

   Arranca en la predeterminada, que es lo que la empresa usa casi siempre: con
   una sola sede la eleccion no llega a serlo, y con varias sigue siendo la
   apuesta correcta.

   Si no hay ninguna no se puede pedir, y se dice aqui con el enlace para
   crearla: descubrirlo al pulsar confirmar es tarde. */

interface DeliveryLocationPickerProps {
  value: string;
  onChange: (locationId: string) => void;
}

export const DeliveryLocationPicker = ({
  value,
  onChange,
}: DeliveryLocationPickerProps) => {
  const { data, isLoading } = useGetDeliveryLocationsQuery();
  const locations = data?.data ?? [];
  /* El id y no el arreglo: `data?.data ?? []` es un arreglo nuevo en cada
     render, y como dependencia del efecto lo dispararia siempre. */
  const predeterminada = locations[0]?.id;

  /* Se elige sola en cuanto llegan. El listado viene ya con la predeterminada
     al frente. */
  useEffect(() => {
    if (!value && predeterminada) onChange(predeterminada);
  }, [value, predeterminada, onChange]);

  if (isLoading) return <p className='font-light'>Cargando sedes...</p>;

  if (locations.length === 0) {
    return (
      <div className='alert alert-warning'>
        No tienes ninguna sede registrada, y un pedido tiene que decir a dónde
        llega.{' '}
        <Link href='/buyer/account/locations'>Registra tu primera sede</Link>.
      </div>
    );
  }

  return (
    <ul className='location-choices'>
      {locations.map((location) => (
        <li key={location.id}>
          <label className={value === location.id ? 'is-chosen' : undefined}>
            <input
              type='radio'
              name='deliveryLocation'
              value={location.id}
              checked={value === location.id}
              onChange={() => onChange(location.id)}
            />
            <span>
              <strong>{location.name}</strong>
              <small className='font-light'>
                {location.address} · {location.city}
                {location.contactName && ` · ${location.contactName}`}
              </small>
              {location.receivingHours && (
                <small className='font-light'>{location.receivingHours}</small>
              )}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
};

export default DeliveryLocationPicker;
