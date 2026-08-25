'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import { Col, Row } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { useAppSelector } from '@/store/hooks';

import { useUpdateProfileMutation } from '../api/authApi';
import { getRoleLabel } from '../lib/roleLabel';

/* Datos personales del usuario, no de su empresa.

   El correo no se edita: es la credencial con la que entra y cambiarlo exige
   volver a verificarlo, tramite que todavia no existe. */

interface ProfileFormProps {
  initialName: string;
  email: string;
  roleLabel: string;
}

/* El formulario va aparte para que su estado inicial se tome cuando el usuario
   ya existe. El panel de cuenta monta todas las pestanas a la vez, de modo que
   esta pantalla se crea antes de que la sesion este lista: un useState en el
   componente de fuera capturaria el nombre vacio y nunca lo actualizaria. */
const ProfileForm = ({ initialName, email, roleLabel }: ProfileFormProps) => {
  const [name, setName] = useState(initialName);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      await updateProfile({ name: name.trim() }).unwrap();
      toast.success('Perfil actualizado');
    } catch (error) {
      setErrorMessage(extractErrorMessage(error, 'No se pudo guardar el perfil.'));
    }
  };

  return (
    <>
      {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col md='6' className='mb-3'>
            <label className='form-label'>Nombre completo</label>
            <input
              type='text'
              className='form-control'
              value={name}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setName(event.target.value)
              }
            />
            {/* "Nombre" a secas se confunde con el nombre comercial de la
                empresa, que se edita en la pestana Mi empresa. */}
            <small className='font-light'>
              Tu nombre, no el de la empresa. Es el que ven tus compañeros de equipo.
            </small>
          </Col>
          <Col md='6' className='mb-3'>
            <label className='form-label'>Correo electrónico</label>
            <input type='email' className='form-control' value={email} disabled readOnly />
            <small className='font-light'>No editable</small>
          </Col>
          <Col md='6' className='mb-3'>
            <label className='form-label'>Rol</label>
            <input type='text' className='form-control' value={roleLabel} disabled readOnly />
          </Col>
        </Row>

        <button
          type='submit'
          className='btn btn-primary btn-sm mt-2'
          disabled={isLoading || !name.trim() || name.trim() === initialName}
        >
          {isLoading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </>
  );
};

export const MyProfileScreen = () => {
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);

  if (!hydrated) {
    return <p className='font-light'>Cargando...</p>;
  }

  if (!user) {
    return <div className='alert alert-secondary'>No hay una sesión activa.</div>;
  }

  return (
    <>
      <div className='box-head'>
        <h3>Mi perfil</h3>
      </div>

      {/* La `key` remonta el formulario cuando cambia el nombre en la sesion,
          de modo que tras guardar recoge el valor nuevo en lugar de quedarse
          con el que habia al montarse. */}
      <ProfileForm
        key={`${user.id}-${user.name}`}
        initialName={user.name}
        email={user.email}
        roleLabel={getRoleLabel(user) ?? 'Sin rol'}
      />
    </>
  );
};

export default MyProfileScreen;
