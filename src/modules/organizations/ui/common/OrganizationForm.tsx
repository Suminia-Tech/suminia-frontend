'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';

import { Panel } from '@/shared/ui';

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
  /* Solo lo manda el proveedor. Cadena vacia significa "sin minimo", que no es
     lo mismo que cero: cero seria exigir un minimo de nada. */
  minOrderValue: string;

  /* La cuenta a donde se le consigna. Tambien solo del proveedor. */
  bankName: string;
  bankAccountType: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  bankAccountHolderTaxId: string;
}

interface OrganizationFormProps {
  organization: Organization;
  isSaving: boolean;
  onSubmit: (values: OrganizationFormValues) => void;
  /* El minimo por pedido solo aparece del lado del proveedor: es lo que exige
     para despachar, y en un comprador no significaria nada. */
  showSupplierFields?: boolean;
}

const toValues = (organization: Organization): OrganizationFormValues => ({
  name: organization.name,
  email: organization.email,
  phone: organization.phone ?? '',
  address: organization.address ?? '',
  city: organization.city ?? '',
  minOrderValue:
    organization.minOrderValue === null ? '' : String(organization.minOrderValue),
  bankName: organization.bankName ?? '',
  bankAccountType: organization.bankAccountType ?? '',
  bankAccountNumber: organization.bankAccountNumber ?? '',
  bankAccountHolder: organization.bankAccountHolder ?? '',
  bankAccountHolderTaxId: organization.bankAccountHolderTaxId ?? '',
});

const OrganizationForm = ({
  organization,
  isSaving,
  onSubmit,
  showSupplierFields = false,
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
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = event.target;
      setValues((current) => ({ ...current, [field]: value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Un panel por asunto, y cada uno dice para que sirve lo que pide. Antes
          eran cuatro `box-head` sobre el fondo gris, con los campos flotando
          debajo: el formulario no tenia ni principio ni final, y nada ataba un
          grupo de campos a su titulo. */}
      <Panel
        title='Datos legales'
        description='Los fijó Suminia al verificar tu empresa y no se editan desde aquí.'
      >
        <div className='form-grid'>
          <div>
            <label className='form-label' htmlFor='empresa-nit'>NIT</label>
            <input
              id='empresa-nit'
              type='text'
              className='form-control'
              value={formatTaxId(organization.taxId)}
              disabled
              readOnly
            />
          </div>
          <div>
            <label className='form-label' htmlFor='empresa-razon'>Razón social</label>
            <input
              id='empresa-razon'
              type='text'
              className='form-control'
              value={organization.legalName}
              disabled
              readOnly
            />
          </div>
        </div>
      </Panel>

      <Panel
        title='Datos de contacto'
        description='Con esto te encuentran los compradores y te llegan los avisos de cada pedido.'
      >
        <div className='form-grid'>
          <div>
            <label className='form-label' htmlFor='empresa-nombre'>Nombre comercial</label>
            <input
              id='empresa-nombre'
              type='text'
              className='form-control'
              value={values.name}
              onChange={handleChange('name')}
            />
          </div>
          <div>
            <label className='form-label' htmlFor='empresa-correo'>Correo de contacto</label>
            <input
              id='empresa-correo'
              type='email'
              className='form-control'
              value={values.email}
              onChange={handleChange('email')}
            />
          </div>
          <div>
            <label className='form-label' htmlFor='empresa-telefono'>Teléfono</label>
            <input
              id='empresa-telefono'
              type='text'
              className='form-control'
              value={values.phone}
              onChange={handleChange('phone')}
            />
          </div>
          <div>
            <label className='form-label' htmlFor='empresa-ciudad'>Ciudad</label>
            <input
              id='empresa-ciudad'
              type='text'
              className='form-control'
              value={values.city}
              onChange={handleChange('city')}
            />
          </div>
          <div className='form-grid-full'>
            <label className='form-label' htmlFor='empresa-direccion'>Dirección</label>
            <input
              id='empresa-direccion'
              type='text'
              className='form-control'
              value={values.address}
              onChange={handleChange('address')}
            />
          </div>
        </div>
      </Panel>

      {showSupplierFields && (
        <>
          <Panel
            title='Condiciones de despacho'
            description='Lo que exiges para sacar un pedido de tu bodega.'
          >
            <div className='form-grid'>
              <div>
                <label className='form-label' htmlFor='empresa-minimo'>Pedido mínimo</label>
                <input
                  id='empresa-minimo'
                  type='number'
                  min={0}
                  step={1000}
                  className='form-control'
                  placeholder='Sin mínimo'
                  value={values.minOrderValue}
                  onChange={handleChange('minOrderValue')}
                />
                <small className='font-light'>
                  Lo menos que despachas por pedido, sumado antes de IVA. Déjalo
                  vacío si no exiges mínimo. Es distinto del pedido mínimo de cada
                  formato, que se fija en el producto.
                </small>
              </div>
            </div>
          </Panel>

          <Panel
            title='Cuenta para recibir pagos'
            description='A dónde Suminia te consigna lo que te corresponde de cada pedido. Va entera o vacía: media cuenta la rechaza el banco el día del pago.'
          >
            <div className='form-grid'>
              <div>
                <label className='form-label' htmlFor='empresa-banco'>Banco</label>
                <input
                  id='empresa-banco'
                  type='text'
                  className='form-control'
                  placeholder='Bancolombia'
                  value={values.bankName}
                  onChange={handleChange('bankName')}
                />
              </div>
              <div>
                <label className='form-label' htmlFor='empresa-tipo-cuenta'>Tipo de cuenta</label>
                <select
                  id='empresa-tipo-cuenta'
                  className='form-control'
                  value={values.bankAccountType}
                  onChange={handleChange('bankAccountType')}
                >
                  <option value=''>Sin definir</option>
                  <option value='AHORROS'>Ahorros</option>
                  <option value='CORRIENTE'>Corriente</option>
                </select>
              </div>
              <div>
                <label className='form-label' htmlFor='empresa-numero'>Número de cuenta</label>
                <input
                  id='empresa-numero'
                  type='text'
                  className='form-control'
                  value={values.bankAccountNumber}
                  onChange={handleChange('bankAccountNumber')}
                />
              </div>
              <div>
                <label className='form-label' htmlFor='empresa-titular'>Titular</label>
                <input
                  id='empresa-titular'
                  type='text'
                  className='form-control'
                  value={values.bankAccountHolder}
                  onChange={handleChange('bankAccountHolder')}
                />
                <small className='font-light'>
                  Puede no ser la razón social: el banco valida el nombre contra el
                  documento.
                </small>
              </div>
              <div>
                <label className='form-label' htmlFor='empresa-titular-nit'>
                  NIT o cédula del titular
                </label>
                <input
                  id='empresa-titular-nit'
                  type='text'
                  className='form-control'
                  value={values.bankAccountHolderTaxId}
                  onChange={handleChange('bankAccountHolderTaxId')}
                />
              </div>
            </div>
          </Panel>
        </>
      )}

      {/* Un solo boton para todo el formulario, al final y fuera de los paneles:
          guarda los cuatro a la vez, de modo que colgarlo del pie de uno de
          ellos sugeriria que solo guarda ese. */}
      <div className='form-actions'>
        <button type='submit' className='btn btn-primary' disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
};

export default OrganizationForm;
