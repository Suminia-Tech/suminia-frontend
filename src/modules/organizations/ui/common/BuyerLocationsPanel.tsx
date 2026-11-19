'use client';

import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatPlace } from '@/shared/lib/colombia';
import { hasZones, ZONE_LABEL, ZONES, type Zone } from '@/shared/lib/zones';
import { Panel } from '@/shared/ui';

import {
  useGetOrganizationLocationsQuery,
  useSetLocationZoneMutation,
} from '../../api/deliveryLocationsApi';

/* Las sedes del comprador, en su ficha del panel de Suminia, con la zona de
   cada una. La elige el comprador al crear la sede; aqui se corrige si quedo
   mal o se completa en las sedes anteriores a que se pidiera. Solo en las
   ciudades que se dividen en zonas. Se guarda al elegirla, sin boton: es un
   dato suelto por sede, y un formulario para uno solo sobra. */
export const BuyerLocationsPanel = ({ organizationId }: { organizationId: string }) => {
  const { data, isLoading } = useGetOrganizationLocationsQuery(organizationId);
  const [setZone, { isLoading: saving }] = useSetLocationZoneMutation();
  const locations = data?.data ?? [];

  const cambiar = async (locationId: string, value: string) => {
    try {
      await setZone({
        locationId,
        organizationId,
        zone: (value || null) as Zone | null,
      }).unwrap();
      toast.success('Zona actualizada');
    } catch (error) {
      toast.error(extractErrorMessage(error, 'No se pudo guardar la zona.'));
    }
  };

  return (
    <Panel
      title='Sedes de entrega'
      description='Dónde recibe sus pedidos. La zona la elige el comprador y aquí se puede corregir.'
    >
      {isLoading ? (
        <p className='font-light mb-0'>Cargando sedes...</p>
      ) : locations.length === 0 ? (
        <p className='font-light mb-0'>Todavía no registra sedes de entrega.</p>
      ) : (
        <ul className='data-list is-single'>
          {locations.map((location) => (
            <li key={location.id}>
              <span className='font-light'>{location.name}</span>
              <span className='location-zone'>
                <span>
                  {location.address} · {formatPlace(location.city, location.department)}
                </span>
                {hasZones(location.city) && (
                  <select
                    className='filter-select'
                    aria-label={`Zona de ${location.name}`}
                    value={location.zone ?? ''}
                    disabled={saving}
                    onChange={(event) => cambiar(location.id, event.target.value)}
                  >
                    <option value=''>Sin zona</option>
                    {ZONES.map((zone) => (
                      <option key={zone} value={zone}>
                        {ZONE_LABEL[zone]}
                      </option>
                    ))}
                  </select>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
};

export default BuyerLocationsPanel;
