'use client';

import { useState } from 'react';
import { Clock, Edit2, MapPin, Phone, Trash2, User } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { hasPermission } from '@/shared/lib/permissions';
import { useAppSelector } from '@/store/hooks';

import {
  useCreateDeliveryLocationMutation,
  useDeleteDeliveryLocationMutation,
  useGetDeliveryLocationsQuery,
  useUpdateDeliveryLocationMutation,
} from '../../api/deliveryLocationsApi';
import type {
  DeliveryLocation,
  DeliveryLocationInput,
} from '../../model/deliveryLocation.types';
import DeliveryLocationForm from './DeliveryLocationForm';

/* Las sedes a donde recibe la empresa.

   Es lo que le falta a una orden para poder existir: "20 cajas a Clinica Santa
   Maria" no dice a que puerta llegan. La direccion que ya tiene la empresa es
   la legal, la de la factura, y en salud casi nunca es donde se descarga.

   Un operador las ve pero no las toca: le hacen falta para elegir a donde va un
   pedido, y cambiarlas es cosa de quien administra la empresa. */

export const DeliveryLocationsScreen = () => {
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const puedeEditar = hasPermission(user?.permissions, 'organization:update');

  /* `null` es "no hay formulario abierto"; una cadena vacia, "estoy creando";
     un id, "estoy editando esa". */
  const [editando, setEditando] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useGetDeliveryLocationsQuery(
    undefined,
    { skip: !hydrated },
  );
  const [crear, creando] = useCreateDeliveryLocationMutation();
  const [actualizar, actualizando] = useUpdateDeliveryLocationMutation();
  const [eliminar, eliminando] = useDeleteDeliveryLocationMutation();

  const guardando = creando.isLoading || actualizando.isLoading;
  const ocupado = guardando || eliminando.isLoading;

  const ejecuta = async (
    accion: () => Promise<unknown>,
    exito: string,
    fallo: string,
  ) => {
    try {
      await accion();
      toast.success(exito);
      setEditando(null);
    } catch (err) {
      toast.error(extractErrorMessage(err, fallo));
    }
  };

  if (!hydrated || isLoading) {
    return <p className='font-light'>Cargando...</p>;
  }

  if (isError) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudieron cargar tus sedes.')}
      </div>
    );
  }

  const locations = data?.data ?? [];

  const guardar = (values: DeliveryLocationInput) => {
    if (editando) {
      return ejecuta(
        () => actualizar({ id: editando, data: values }).unwrap(),
        'Sede actualizada',
        'No se pudo guardar la sede.',
      );
    }

    return ejecuta(
      () => crear(values).unwrap(),
      'Sede añadida',
      'No se pudo añadir la sede.',
    );
  };

  const enEdicion = (location: DeliveryLocation) => editando === location.id;

  return (
    <>
      <div className='box-head'>
        <h3>Sedes de entrega</h3>
      </div>

      <p className='font-light'>
        A dónde llegan tus pedidos. La dirección de tu empresa es la legal, la de
        la factura; aquí va la puerta por la que se descarga.
      </p>

      {locations.length === 0 && (
        <div className='alert alert-warning'>
          Todavía no tienes ninguna sede. Necesitas al menos una para poder
          hacer un pedido.
        </div>
      )}

      <ul className='location-list'>
        {locations.map((location) => (
          <li className='location-card' key={location.id}>
            {enEdicion(location) ? (
              <DeliveryLocationForm
                location={location}
                isSaving={guardando}
                onSubmit={guardar}
                onCancel={() => setEditando(null)}
              />
            ) : (
              <>
                <div className='location-card-head'>
                  <h4>
                    {location.name}
                    {location.isDefault && (
                      <span className='location-default'>Predeterminada</span>
                    )}
                  </h4>

                  {puedeEditar && (
                    <div className='location-actions'>
                      {!location.isDefault && (
                        <button
                          type='button'
                          className='btn btn-sm btn-outline-secondary'
                          disabled={ocupado}
                          onClick={() =>
                            ejecuta(
                              () =>
                                actualizar({
                                  id: location.id,
                                  data: { isDefault: true },
                                }).unwrap(),
                              `${location.name} es ahora la predeterminada`,
                              'No se pudo cambiar la sede predeterminada.',
                            )
                          }
                        >
                          Hacer predeterminada
                        </button>
                      )}
                      <button
                        type='button'
                        aria-label={`Editar ${location.name}`}
                        disabled={ocupado}
                        onClick={() => setEditando(location.id)}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type='button'
                        aria-label={`Quitar ${location.name}`}
                        disabled={ocupado}
                        onClick={() =>
                          ejecuta(
                            () => eliminar(location.id).unwrap(),
                            'Sede retirada',
                            'No se pudo retirar la sede.',
                          )
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>

                <p className='location-address'>
                  <MapPin size={14} />
                  {location.address} · {location.city}
                  {location.department && `, ${location.department}`}
                </p>

                <ul className='location-details'>
                  {location.contactName && (
                    <li>
                      <User size={13} />
                      {location.contactName}
                    </li>
                  )}
                  {location.contactPhone && (
                    <li>
                      <Phone size={13} />
                      {location.contactPhone}
                    </li>
                  )}
                  {location.receivingHours && (
                    <li>
                      <Clock size={13} />
                      {location.receivingHours}
                    </li>
                  )}
                </ul>

                {location.notes && (
                  <p className='location-notes font-light'>{location.notes}</p>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {puedeEditar &&
        (editando === '' ? (
          <div className='location-card'>
            <DeliveryLocationForm
              isSaving={guardando}
              onSubmit={guardar}
              onCancel={() => setEditando(null)}
            />
          </div>
        ) : (
          <button
            type='button'
            className='btn btn-primary btn-sm'
            disabled={ocupado}
            onClick={() => setEditando('')}
          >
            Añadir sede
          </button>
        ))}
    </>
  );
};

export default DeliveryLocationsScreen;
