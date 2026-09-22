'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { PageHeader, Panel } from '@/shared/ui';
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

  const sinCambios = !name.trim() || name.trim() === initialName;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Panel
        narrow
        title='Datos de la cuenta'
        description='El nombre es el que ve tu equipo y el que acompaña a los pedidos que gestionas.'
        footer={
          /* El boton primario a secas y no `SubmitButton`: aquel envuelve el
             `Button` de reactstrap, que sin variante sale `btn-secondary` —por
             eso la accion principal de la pantalla se veia apagada— y ademas le
             cuelga un tic que solo encaja en las pantallas de acceso, que es
             donde el tema lo estiliza. */
          <button
            type='submit'
            className='btn btn-primary'
            disabled={isLoading || sinCambios}
          >
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        }
      >
        {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}

        <div className='form-grid'>
          <div>
            <label className='form-label' htmlFor='perfil-nombre'>
              Nombre del usuario
            </label>
            <input
              id='perfil-nombre'
              type='text'
              className='form-control'
              value={name}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setName(event.target.value)
              }
            />
          </div>

          <div>
            <label className='form-label' htmlFor='perfil-correo'>
              Correo electrónico
            </label>
            <input
              id='perfil-correo'
              type='email'
              className='form-control'
              value={email}
              disabled
              readOnly
            />
            {/* El correo es la credencial con la que se entra: cambiarlo exige
                volver a verificarlo, y ese tramite todavia no existe. */}
            <small className='font-light'>
              Es tu credencial de acceso, de momento no se puede cambiar.
            </small>
          </div>

          <div>
            <label className='form-label' htmlFor='perfil-rol'>
              Rol
            </label>
            <input
              id='perfil-rol'
              type='text'
              className='form-control'
              value={roleLabel}
              disabled
              readOnly
            />
            <small className='font-light'>
              Lo asigna el administrador de tu empresa.
            </small>
          </div>
        </div>
      </Panel>
    </form>
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
      <PageHeader
        title='Mi perfil'
        description='Tus datos personales. Los de la empresa se editan en Mi empresa.'
      />

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
