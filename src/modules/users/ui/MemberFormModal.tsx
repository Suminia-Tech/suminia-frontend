'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { extractErrorMessage, extractFieldErrors } from '@/shared/lib/apiError';
import {
  STRONG_PASSWORD_HINT,
  isEmail,
  isStrongPassword,
} from '@/shared/lib/validators';

import { useCreateMemberMutation } from '../api/usersApi';
import { getAssignableRoles } from '../lib/userLabels';

/* Alta de un miembro del equipo. La empresa no se pide: el backend la toma de
   la sesion de quien crea, de modo que no hay forma de dar de alta a alguien
   en otra organizacion.

   Sigue la estructura de los modales del panel de cuenta (add-address-modal):
   la cabecera va vacia porque el tema saca su boton de cierre fuera del marco,
   el contenido va en el cuerpo y las acciones en el pie. */

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRoles: string[];
}

const FORM_ID = 'member-form';
const INITIAL = { name: '', email: '', phone: '', password: '', roleName: '' };

const MemberFormModal = ({
  isOpen,
  onClose,
  currentUserRoles,
}: MemberFormModalProps) => {
  const roles = getAssignableRoles(currentUserRoles);
  const [form, setForm] = useState({ ...INITIAL, roleName: roles[0]?.value ?? '' });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [createMember, { isLoading }] = useCreateMemberMutation();

  const handleChange =
    (field: keyof typeof INITIAL) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = event.target;
      setForm((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setGeneralError(null);
    };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Ingresa el nombre';
    if (!form.email.trim()) next.email = 'Ingresa el correo';
    else if (!isEmail(form.email.trim()))
      next.email = 'El correo no tiene un formato válido';
    if (!form.password) next.password = 'Ingresa una contraseña';
    else if (!isStrongPassword(form.password)) next.password = STRONG_PASSWORD_HINT;
    if (!form.roleName) next.roleName = 'Selecciona un rol';
    return next;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);

    try {
      await createMember({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
        roleName: form.roleName,
      }).unwrap();

      setForm({ ...INITIAL, roleName: roles[0]?.value ?? '' });
      setErrors({});
      onClose();
    } catch (error) {
      const fieldErrors = extractFieldErrors(error);
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length === 0) {
        setGeneralError(extractErrorMessage(error, 'No se pudo crear el miembro.'));
      }
    }
  };

  return (
    <Modal className='add-address-modal' centered isOpen={isOpen} toggle={onClose}>
      {/* Vacia a proposito: el tema posiciona el boton de cierre fuera del
          marco y le da padding cero a la cabecera. */}
      <ModalHeader toggle={onClose}></ModalHeader>

      <ModalBody>
        <div className='box-head'>
          <h3>Añadir miembro</h3>
        </div>

        <form id={FORM_ID} onSubmit={handleSubmit} noValidate>
          <div className='mb-3'>
            <label className='form-label font-light'>Nombre del usuario</label>
            <input
              type='text'
              className='form-control'
              value={form.name}
              onChange={handleChange('name')}
            />
            {errors.name && <small className='text-danger'>{errors.name}</small>}
          </div>

          <div className='mb-3'>
            <label className='form-label font-light'>Correo electrónico</label>
            <input
              type='email'
              className='form-control'
              value={form.email}
              onChange={handleChange('email')}
            />
            {errors.email && <small className='text-danger'>{errors.email}</small>}
          </div>

          <div className='mb-3'>
            <label className='form-label font-light'>Teléfono (opcional)</label>
            <input
              type='text'
              className='form-control'
              value={form.phone}
              onChange={handleChange('phone')}
            />
          </div>

          <div className='mb-3'>
            <label className='form-label font-light'>Rol</label>
            <select
              className='form-control'
              value={form.roleName}
              onChange={handleChange('roleName')}
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.roleName && <small className='text-danger'>{errors.roleName}</small>}
          </div>

          <div>
            <label className='form-label font-light'>Contraseña inicial</label>
            <input
              type='text'
              className='form-control'
              value={form.password}
              onChange={handleChange('password')}
            />
            {errors.password ? (
              <small className='text-danger'>{errors.password}</small>
            ) : (
              <small className='font-light'>
                Compártela con la persona. Recibirá un correo para verificar su cuenta
                antes de poder entrar.
              </small>
            )}
          </div>

          {generalError && <div className='alert alert-danger mt-3'>{generalError}</div>}
        </form>
      </ModalBody>

      <ModalFooter className='pt-0 text-end d-block'>
        <button
          type='button'
          className='btn btn-outline-secondary rounded-1 me-2'
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type='submit'
          form={FORM_ID}
          className='btn btn-primary rounded-1'
          disabled={isLoading}
        >
          {isLoading ? 'Creando...' : 'Crear miembro'}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default MemberFormModal;
