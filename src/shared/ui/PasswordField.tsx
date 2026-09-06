'use client';

import { useState, type ChangeEvent } from 'react';
import { Eye, EyeOff } from 'react-feather';

/* Input de contraseña con su boton de mostrar/ocultar ya integrado.

   PasswordToggle depende de .login-section .input para posicionarse, de modo
   que solo sirve en las pantallas de acceso. Este componente trae su propio
   contenedor y funciona en cualquier formulario.

   aria-label cambia con el estado para que un lector de pantalla anuncie la
   accion, y tabIndex -1 lo saca del recorrido con Tab: es una ayuda visual, no
   un paso del formulario. */

interface PasswordFieldProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  placeholder?: string;
  autoComplete?: string;
}

const PasswordField = ({
  value,
  onChange,
  id,
  placeholder,
  autoComplete,
}: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className='password-field'>
      <input
        type={visible ? 'text' : 'password'}
        className='form-control'
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button
        type='button'
        className='password-field-toggle'
        onClick={() => setVisible((current) => !current)}
        tabIndex={-1}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default PasswordField;
