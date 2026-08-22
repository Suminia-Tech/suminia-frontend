'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import { Col, Row } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { useAppSelector } from '@/store/hooks';

import { useUpdateMemberMutation } from '../api/usersApi';
import { getTeamRoleLabel } from '../lib/userLabels';

/* Datos personales del usuario, no de su empresa.

   El correo no se edita: es la credencial con la que entra y cambiarlo exige
   volver a verificarlo, tramite que todavia no existe. */
export const MyProfileScreen = () => {
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);

  const [name, setName] = useState(user?.name ?? '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updateMember, { isLoading }] = useUpdateMemberMutation();

  if (!hydrated) {
    return <p className='font-light'>Cargando...</p>;
  }

  if (!user) {
    return <div className='alert alert-secondary'>No hay una sesión activa.</div>;
  }

  const roles = (user.roles ?? []).map((role) =>
    typeof role === 'string' ? role : role.name,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      await updateMember({ id: user.id, data: { name: name.trim() } }).unwrap();
      toast.success('Perfil actualizado');
    } catch (error) {
      setErrorMessage(extractErrorMessage(error, 'No se pudo guardar el perfil.'));
    }
  };

  return (
    <>
      <div className='box-head'>
        <h3>Mi perfil</h3>
      </div>

      {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col md='6' className='mb-3'>
            <label className='form-label'>Nombre</label>
            <input
              type='text'
              className='form-control'
              value={name}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setName(event.target.value)
              }
            />
          </Col>
          <Col md='6' className='mb-3'>
            <label className='form-label'>Correo electrónico</label>
            <input type='email' className='form-control' value={user.email} disabled readOnly />
            <small className='font-light'>No editable</small>
          </Col>
          <Col md='6' className='mb-3'>
            <label className='form-label'>Rol</label>
            <input
              type='text'
              className='form-control'
              value={getTeamRoleLabel(roles)}
              disabled
              readOnly
            />
          </Col>
        </Row>

        <button
          type='submit'
          className='btn btn-primary btn-sm mt-2'
          disabled={isLoading || !name.trim()}
        >
          {isLoading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </>
  );
};

export default MyProfileScreen;
