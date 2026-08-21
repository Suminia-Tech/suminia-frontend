'use client';

import { useState, type FormEvent } from 'react';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';

import { SubmitButton } from '@/shared/ui';

import { formatTaxId } from '../../lib/taxId';
import type { Organization } from '../../model/organization.types';

/* Formulario comun a proveedores y compradores: los campos salen de
   Organization, que es la tabla que ambos comparten en el backend.

   taxId y legalName se muestran pero no se editan: identifican legalmente a la
   empresa y el DTO del backend los rechaza con 422. Cambiarlos es un tramite
   que pasa por el personal interno de Suminia. */

export interface OrganizationFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

interface OrganizationFormProps {
  organization: Organization;
  isSaving: boolean;
  onSubmit: (values: OrganizationFormValues) => void;
}

const toValues = (organization: Organization): OrganizationFormValues => ({
  name: organization.name,
  email: organization.email,
  phone: organization.phone ?? '',
  address: organization.address ?? '',
  city: organization.city ?? '',
});

const OrganizationForm = ({
  organization,
  isSaving,
  onSubmit,
}: OrganizationFormProps) => {
  /* El estado inicial se toma una sola vez. Para recoger los datos frescos tras
     guardar, quien renderiza este formulario le pasa una `key` que cambia con
     updatedAt: React lo remonta y vuelve a leer las props. Es preferible a
     sincronizar con un efecto, que provoca un render en cascada. */
  const [values, setValues] = useState<OrganizationFormValues>(() =>
    toValues(organization),
  );

  const handleChange =
    (field: keyof OrganizationFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues((current) => ({ ...current, [field]: value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Row>
        <Col md='6'>
          <FormGroup>
            <Label>NIT</Label>
            <Input type='text' value={formatTaxId(organization.taxId)} disabled readOnly />
            <small className='text-muted'>No editable</small>
          </FormGroup>
        </Col>
        <Col md='6'>
          <FormGroup>
            <Label>Razón social</Label>
            <Input type='text' value={organization.legalName} disabled readOnly />
            <small className='text-muted'>No editable</small>
          </FormGroup>
        </Col>

        <Col md='6'>
          <FormGroup>
            <Label>Nombre comercial</Label>
            <Input type='text' value={values.name} onChange={handleChange('name')} />
          </FormGroup>
        </Col>
        <Col md='6'>
          <FormGroup>
            <Label>Correo de contacto</Label>
            <Input type='email' value={values.email} onChange={handleChange('email')} />
          </FormGroup>
        </Col>

        <Col md='6'>
          <FormGroup>
            <Label>Teléfono</Label>
            <Input type='text' value={values.phone} onChange={handleChange('phone')} />
          </FormGroup>
        </Col>
        <Col md='6'>
          <FormGroup>
            <Label>Ciudad</Label>
            <Input type='text' value={values.city} onChange={handleChange('city')} />
          </FormGroup>
        </Col>

        <Col md='12'>
          <FormGroup>
            <Label>Dirección</Label>
            <Input type='text' value={values.address} onChange={handleChange('address')} />
          </FormGroup>
        </Col>
      </Row>

      <SubmitButton isLoading={isSaving} loadingLabel='Guardando...'>
        Guardar cambios
      </SubmitButton>
    </form>
  );
};

export default OrganizationForm;
