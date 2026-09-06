'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { Col, Row } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { hasPermission } from '@/shared/lib/permissions';
import { useAppSelector } from '@/store/hooks';

import {
  useGetSupplierQuery,
  useUpdateSupplierMutation,
} from '../../api/suppliersApi';
import OrganizationForm, {
  type OrganizationFormValues,
} from '../common/OrganizationForm';
import StatusBadge from '../common/StatusBadge';

/* Primera pantalla propia del proveedor: sus datos de empresa y su estado de
   aprobacion.

   El id de la organizacion sale de la sesion, no de la URL: un proveedor solo
   puede ver la suya, y el backend lo verifica ademas por su cuenta. */
export const MyCompanyScreen = () => {
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const organizationId = user?.organizationId ?? null;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useGetSupplierQuery(
    organizationId as string,
    { skip: !organizationId },
  );
  const [updateSupplier, { isLoading: isSaving }] = useUpdateSupplierMutation();

  const canEdit = hasPermission(user?.permissions, 'organization:update');
  const supplier = data?.data;

  const readOnlyFields = [
    { label: 'Razón social', value: supplier?.legalName },
    { label: 'Correo de contacto', value: supplier?.email },
    { label: 'Teléfono', value: supplier?.phone },
    { label: 'Ciudad', value: supplier?.city },
    { label: 'Dirección', value: supplier?.address },
  ];

  const handleSubmit = async (values: OrganizationFormValues) => {
    if (!organizationId) return;
    setErrorMessage(null);

    try {
      await updateSupplier({
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

  if (isError || !supplier) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudieron cargar los datos de la empresa.')}
      </div>
    );
  }

  return (
    <>
      <Row className='mb-4 align-items-center'>
        <Col>
          <h2 className='mb-1'>{supplier.name}</h2>
          <StatusBadge status={supplier.status} />
        </Col>
      </Row>

      {supplier.status === 'PENDING' && (
        <div className='alert alert-warning'>
          Tu empresa está pendiente de aprobación. El equipo de Suminia revisa los
          datos y te avisa cuando quede activa.
        </div>
      )}

      {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}

      <div className='dashboard-profile'>
        {canEdit ? (
            <OrganizationForm
            key={supplier.updatedAt}
            organization={supplier}
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
