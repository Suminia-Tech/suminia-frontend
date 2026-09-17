'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Col, Row } from 'reactstrap';

import type {
  DeliveryLocation,
  DeliveryLocationInput,
} from '../../model/deliveryLocation.types';

/* El formulario de una sede, para crearla o editarla.

   Solo tres campos son obligatorios —nombre, direccion y ciudad—: es lo minimo
   para que un transportador llegue. El resto ahorra llamadas el dia de la
   entrega, pero exigirlo de entrada solo conseguiria que se rellenara con
   cualquier cosa. */

const VACIA: DeliveryLocationInput = {
  name: '',
  address: '',
  city: '',
  department: '',
  contactName: '',
  contactPhone: '',
  receivingHours: '',
  notes: '',
};

const aFormulario = (location: DeliveryLocation): DeliveryLocationInput => ({
  name: location.name,
  address: location.address,
  city: location.city,
  department: location.department ?? '',
  contactName: location.contactName ?? '',
  contactPhone: location.contactPhone ?? '',
  receivingHours: location.receivingHours ?? '',
  notes: location.notes ?? '',
});

interface DeliveryLocationFormProps {
  location?: DeliveryLocation;
  isSaving: boolean;
  onSubmit: (values: DeliveryLocationInput) => void;
  onCancel: () => void;
}

export const DeliveryLocationForm = ({
  location,
  isSaving,
  onSubmit,
  onCancel,
}: DeliveryLocationFormProps) => {
  const [values, setValues] = useState<DeliveryLocationInput>(() =>
    location ? aFormulario(location) : VACIA,
  );

  const cambiar =
    (campo: keyof DeliveryLocationInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setValues((actual) => ({ ...actual, [campo]: value }));
    };

  const enviar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    /* Cadena vacia significa "sin dato": el backend guarda null y no "". */
    onSubmit({
      name: values.name.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
      department: values.department?.trim() || null,
      contactName: values.contactName?.trim() || null,
      contactPhone: values.contactPhone?.trim() || null,
      receivingHours: values.receivingHours?.trim() || null,
      notes: values.notes?.trim() || null,
    });
  };

  return (
    <form onSubmit={enviar} className='location-form' noValidate>
      <Row>
        <Col md='6' className='mb-3'>
          <label className='form-label'>Nombre de la sede</label>
          <input
            type='text'
            className='form-control'
            placeholder='Sede Norte'
            value={values.name}
            onChange={cambiar('name')}
            required
          />
        </Col>
        <Col md='6' className='mb-3'>
          <label className='form-label'>Ciudad</label>
          <input
            type='text'
            className='form-control'
            value={values.city}
            onChange={cambiar('city')}
            required
          />
        </Col>
        <Col md='8' className='mb-3'>
          <label className='form-label'>Dirección</label>
          <input
            type='text'
            className='form-control'
            placeholder='Calle 127 # 15-40, torre B'
            value={values.address}
            onChange={cambiar('address')}
            required
          />
        </Col>
        <Col md='4' className='mb-3'>
          <label className='form-label'>Departamento</label>
          <input
            type='text'
            className='form-control'
            value={values.department ?? ''}
            onChange={cambiar('department')}
          />
        </Col>
        <Col md='6' className='mb-3'>
          <label className='form-label'>Quién recibe</label>
          <input
            type='text'
            className='form-control'
            value={values.contactName ?? ''}
            onChange={cambiar('contactName')}
          />
        </Col>
        <Col md='6' className='mb-3'>
          <label className='form-label'>Teléfono de la sede</label>
          <input
            type='text'
            className='form-control'
            value={values.contactPhone ?? ''}
            onChange={cambiar('contactPhone')}
          />
        </Col>
        <Col md='6' className='mb-3'>
          <label className='form-label'>Horario de recepción</label>
          <input
            type='text'
            className='form-control'
            placeholder='Lunes a viernes de 7 a 11 am'
            value={values.receivingHours ?? ''}
            onChange={cambiar('receivingHours')}
          />
        </Col>
        <Col md='6' className='mb-3'>
          <label className='form-label'>Cómo entrar</label>
          <input
            type='text'
            className='form-control'
            placeholder='Muelle de carga, portería 2'
            value={values.notes ?? ''}
            onChange={cambiar('notes')}
          />
        </Col>
      </Row>

      <div className='d-flex gap-2'>
        <button type='submit' className='btn btn-primary btn-sm' disabled={isSaving}>
          {isSaving ? 'Guardando...' : location ? 'Guardar cambios' : 'Añadir sede'}
        </button>
        <button
          type='button'
          className='btn btn-outline-secondary btn-sm'
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default DeliveryLocationForm;
