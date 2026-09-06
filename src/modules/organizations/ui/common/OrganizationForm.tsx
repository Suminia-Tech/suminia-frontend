'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Col, Row } from 'reactstrap';

import { formatTaxId } from '../../lib/taxId';
import type { Organization } from '../../model/organization.types';

/* Formulario comun a proveedores y compradores: los campos salen de
   Organization, que es la tabla que ambos comparten en el backend.

   Usa las clases del tema (form-label, form-control, box-head) en lugar de los
   componentes de reactstrap sin estilar, para que la pantalla se vea como el
   resto del panel de cuenta.

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
    (field: keyof OrganizationFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues((current) => ({ ...current, [field]: value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className='box-head'>
        <h3>Datos legales</h3>
      </div>
      <Row className='mb-4'>
        <Col md='6' className='mb-3'>
          <label className='form-label'>NIT</label>
          <input
            type='text'
            className='form-control'
            value={formatTaxId(organization.taxId)}
            disabled
            readOnly
          />
          <small className='font-light'>Solo Suminia puede modificarlo</small>
        </Col>
        <Col md='6' className='mb-3'>
          <label className='form-label'>Razón social</label>
          <input
            type='text'
            className='form-control'
            value={organization.legalName}
            disabled
            readOnly
          />
          <small className='font-light'>Solo Suminia puede modificarlo</small>
        </Col>
      </Row>

      <div className='box-head'>
        <h3>Datos de contacto</h3>
      </div>
      <Row>
        <Col md='6' className='mb-3'>
          <label className='form-label'>Nombre comercial</label>
          <input
            type='text'
            className='form-control'
            value={values.name}
            onChange={handleChange('name')}
          />
        </Col>
        <Col md='6' className='mb-3'>
          <label className='form-label'>Correo de contacto</label>
          <input
            type='email'
            className='form-control'
            value={values.email}
            onChange={handleChange('email')}
          />
        </Col>
        <Col md='6' className='mb-3'>
          <label className='form-label'>Teléfono</label>
          <input
            type='text'
            className='form-control'
            value={values.phone}
            onChange={handleChange('phone')}
          />
        </Col>
        <Col md='6' className='mb-3'>
          <label className='form-label'>Ciudad</label>
          <input
            type='text'
            className='form-control'
            value={values.city}
            onChange={handleChange('city')}
          />
        </Col>
        <Col md='12' className='mb-3'>
          <label className='form-label'>Dirección</label>
          <input
            type='text'
            className='form-control'
            value={values.address}
            onChange={handleChange('address')}
          />
        </Col>
      </Row>

      <button type='submit' className='btn btn-primary btn-sm mt-3' disabled={isSaving}>
        {isSaving ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  );
};

export default OrganizationForm;
