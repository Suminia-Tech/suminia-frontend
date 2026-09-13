'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { Col, Row } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/dates';
import { hasPermission } from '@/shared/lib/permissions';
import { useAppSelector } from '@/store/hooks';

import {
  useOrganizationDetail,
  useOrganizationUpdate,
  type OrganizationKind,
} from '../../hooks/useOrganizationAdmin';
import type { OrganizationStatus } from '../../model/organization.types';
import OrganizationForm, { type OrganizationFormValues } from './OrganizationForm';
import StatusBadge from './StatusBadge';

/* Los datos de la propia empresa y en que va su solicitud.

   El id sale de la sesion y no de la URL: cada quien solo puede ver la suya, y
   el backend lo verifica ademas por su cuenta.

   Es la misma pantalla para los dos lados del marketplace —se registran igual y
   se aprueban igual— y lo unico que cambia es a que endpoint va.

   El bloque de estado existe porque la franja de arriba dice "estamos
   verificando tu empresa" y ahi se acababa la historia: no habia donde ver que
   se mando, ni cuando, ni que falta. Una solicitud que no se puede consultar se
   parece demasiado a una que se perdio. */

const EXPLICACION: Record<OrganizationStatus, string | null> = {
  PENDING:
    'El equipo de Suminia revisa a mano los datos de cada empresa. Te avisamos por correo en cuanto quede aprobada; mientras tanto puedes navegar el catálogo, pero los precios no se muestran.',
  ACTIVE: null,
  SUSPENDED:
    'Tu empresa está suspendida: puedes entrar y consultar el catálogo, pero no ver precios ni comprar. Escríbenos para saber que hace falta para reactivarla.',
  REJECTED:
    'Tu solicitud no fue aprobada. Si crees que se trata de un error, escríbenos y la revisamos de nuevo.',
};

const CLASE_AVISO: Record<OrganizationStatus, string> = {
  PENDING: 'alert alert-warning',
  ACTIVE: 'alert alert-success',
  SUSPENDED: 'alert alert-danger',
  REJECTED: 'alert alert-danger',
};

export const MyCompanyScreen = ({ kind }: { kind: OrganizationKind }) => {
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const organizationId = user?.organizationId ?? null;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useOrganizationDetail(
    kind,
    organizationId as string,
    { skip: !organizationId },
  );
  const { update, isSaving } = useOrganizationUpdate(kind);

  const canEdit = hasPermission(user?.permissions, 'organization:update');
  const organization = data?.data;

  const handleSubmit = async (values: OrganizationFormValues) => {
    if (!organizationId) return;
    setErrorMessage(null);

    try {
      await update({
        id: organizationId,
        data: {
          name: values.name.trim(),
          email: values.email.trim(),
          // Cadena vacia significa "sin dato": el backend acepta null para
          // limpiar el campo, pero rechaza "" en los que valida formato.
          phone: values.phone.trim() || null,
          address: values.address.trim() || null,
          city: values.city.trim() || null,
        },
      }).unwrap();
      toast.success('Datos actualizados');
    } catch (err) {
      setErrorMessage(extractErrorMessage(err, 'No se pudieron guardar los cambios.'));
    }
  };

  if (!hydrated || isLoading) {
    return <p className='font-light'>Cargando...</p>;
  }

  /* El personal interno de Suminia no pertenece a ninguna organizacion, de modo
     que esta pantalla no aplica para ellos. */
  if (!organizationId) {
    return (
      <div className='alert alert-secondary'>
        Tu cuenta no está asociada a ninguna empresa.
      </div>
    );
  }

  if (isError || !organization) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudieron cargar los datos de la empresa.')}
      </div>
    );
  }

  const explicacion = EXPLICACION[organization.status];
  const enviada = formatDate(organization.createdAt);
  const aprobada = formatDate(organization.approvedAt);

  const readOnlyFields = [
    { label: 'Razón social', value: organization.legalName },
    { label: 'Correo de contacto', value: organization.email },
    { label: 'Teléfono', value: organization.phone },
    { label: 'Ciudad', value: organization.city },
    { label: 'Dirección', value: organization.address },
  ];

  return (
    <>
      <Row className='mb-4 align-items-center'>
        <Col>
          <h2 className='mb-1'>{organization.name}</h2>
          <StatusBadge status={organization.status} />
        </Col>
      </Row>

      <div className='box-head'>
        <h3>Estado de la solicitud</h3>
      </div>

      {explicacion && (
        <div className={CLASE_AVISO[organization.status]}>{explicacion}</div>
      )}

      {/* El estado no se repite aqui: ya esta en la etiqueta de al lado del
          nombre, y el aviso de arriba explica lo que significa. */}
      <div className='dashboard-profile mb-4'>
        <ul className='dash-profile'>
          {enviada && (
            <li>
              <div className='left'>
                <h6 className='font-light'>Solicitud enviada</h6>
              </div>
              <div className='right'>
                <h6>{enviada}</h6>
              </div>
            </li>
          )}
          {aprobada && (
            <li>
              <div className='left'>
                <h6 className='font-light'>Aprobada el</h6>
              </div>
              <div className='right'>
                <h6>{aprobada}</h6>
              </div>
            </li>
          )}
        </ul>
      </div>

      {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}

      <div className='dashboard-profile'>
        {canEdit ? (
          <OrganizationForm
            key={organization.updatedAt}
            organization={organization}
            isSaving={isSaving}
            onSubmit={handleSubmit}
          />
        ) : (
          /* Sin organization:update los datos se muestran en la misma lista
             etiqueta/valor que usa el panel de cuenta de la plantilla. */
          <ul className='dash-profile'>
            {readOnlyFields.map(({ label, value }) => (
              <li key={label}>
                <div className='left'>
                  <h6 className='font-light'>{label}</h6>
                </div>
                <div className='right'>
                  <h6>{value ?? '—'}</h6>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default MyCompanyScreen;
