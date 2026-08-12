/* Comprobacion de permisos como funcion pura. Vive en shared porque la
   necesitan todos los modulos, y no puede vivir en modules/auth porque un
   modulo no importa otro modulo.

   La lista de permisos la entrega el backend en el login, ya aplanada a partir
   de los roles del usuario. Cada pantalla la lee del store con useAppSelector
   y la pasa aqui. */

export const hasPermission = (
  permissions: readonly string[] | undefined,
  required: string,
): boolean => permissions?.includes(required) ?? false;

export const hasAnyPermission = (
  permissions: readonly string[] | undefined,
  required: readonly string[],
): boolean => required.some((permission) => hasPermission(permissions, permission));
