'use client';

import { Eye, EyeOff } from 'react-feather';

/* Boton que alterna la visibilidad de un campo de contraseña. Se coloca dentro
   del contenedor .input, que el tema ya define como position: relative.

   aria-label cambia con el estado para que un lector de pantalla anuncie la
   accion, y tabIndex -1 lo saca del recorrido con Tab: es una ayuda visual, no
   un paso del formulario. */

interface PasswordToggleProps {
  visible: boolean;
  onToggle: () => void;
}

const PasswordToggle = ({ visible, onToggle }: PasswordToggleProps) => (
  <button
    type='button'
    className='password-toggle'
    onClick={onToggle}
    tabIndex={-1}
    aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
  >
    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
);

export default PasswordToggle;
