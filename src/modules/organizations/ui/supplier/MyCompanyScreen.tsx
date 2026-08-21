'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { Alert, Card, CardBody, Col, Container, Row } from 'reactstrap';

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
    return <p className='text-muted'>Cargando...</p>;
  }

  /* El personal interno de Suminia no pertenece a ninguna organizacion, de modo
     que esta pantalla no aplica para ellos. */
  if (!organizationId) {
    return (
      <Alert color='secondary'>
        Tu cuenta no está asociada a ninguna empresa.
      </Alert>
    );
  }

  if (isError || !supplier) {
    return (
      <Alert color='danger'>
        {extractErrorMessage(error, 'No se pudieron cargar los datos de la empresa.')}
      </Alert>
    );
  }

  return (
    <section className='section-b-space'>
      <Container>
        <Row className='mb-4 align-items-center'>
          <Col>
            <h2 className='mb-1'>{supplier.name}</h2>
            <StatusBadge status={supplier.status} />
          </Col>
        </Row>

        {supplier.status === 'PENDING' && (
          <Alert color='warning'>
            Tu empresa está pendiente de aprobación. El equipo de Suminia revisa los
            datos y te avisa cuando quede activa.
          </Alert>
        )}

        {errorMessage && <Alert color='danger'>{errorMessage}</Alert>}

        <Card>
          <CardBody>
            {canEdit ? (
              <OrganizationForm
                key={supplier.updatedAt}
                organization={supplier}
                isSaving={isSaving}
                onSubmit={handleSubmit}
              />
            ) : (
              <Row>
                <Col md='6'>
                  <p className='mb-1 text-muted'>Correo de contacto</p>
                  <p>{supplier.email}</p>
                </Col>
                <Col md='6'>
                  <p className='mb-1 text-muted'>Teléfono</p>
                  <p>{supplier.phone ?? '—'}</p>
                </Col>
                <Col md='6'>
                  <p className='mb-1 text-muted'>Ciudad</p>
                  <p>{supplier.city ?? '—'}</p>
                </Col>
                <Col md='6'>
                  <p className='mb-1 text-muted'>Dirección</p>
                  <p>{supplier.address ?? '—'}</p>
                </Col>
              </Row>
            )}
          </CardBody>
        </Card>
      </Container>
    </section>
  );
};

export default MyCompanyScreen;
