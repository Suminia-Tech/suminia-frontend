import { STRONG_PASSWORD_HINT, isStrongPassword } from '@/shared/lib/validators';

export interface PasswordFields {
  password: string;
  confirmPassword: string;
}

/* Reglas de contrasena nueva compartidas por el registro y el restablecimiento,
   que antes las tenian copiadas. */
export const validatePasswordFields = ({
  password,
  confirmPassword,
}: PasswordFields): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!password) errors.password = 'Ingresa una contraseña';
  else if (!isStrongPassword(password)) errors.password = STRONG_PASSWORD_HINT;

  if (!confirmPassword) errors.confirmPassword = 'Confirma tu contraseña';
  else if (password !== confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden';

  return errors;
};
