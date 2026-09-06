export const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/* Requisito de IsStrongPassword del backend con sus opciones por defecto:
   8 caracteres como minimo, con mayuscula, minuscula, numero y simbolo.
   Estaba duplicado en el registro y en el restablecimiento de contrasena. */
export const isStrongPassword = (value: string): boolean =>
  value.length >= 8 &&
  /[a-z]/.test(value) &&
  /[A-Z]/.test(value) &&
  /[0-9]/.test(value) &&
  /[^A-Za-z0-9]/.test(value);

export const STRONG_PASSWORD_HINT =
  'Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo';
