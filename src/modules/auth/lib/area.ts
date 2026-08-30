import type { RoleName, User } from '../model/auth.types';

/* Cada rol pertenece a un area del sitio, y el area es el primer segmento de la
   URL: /proveedor, /comprador, /admin. Tenerlo en la ruta es lo que permite que
   cada layout monte su propio chasis sin preguntar quien eres — el rol ya viene
   decidido por donde estas parado.

   Esta es la unica traduccion rol -> area del proyecto. Si aparece un rol nuevo
   se agrega aqui y todo lo demas sigue funcionando. */

export type Area = 'proveedor' | 'comprador' | 'admin';

const AREA_BY_ROLE: Record<RoleName, Area> = {
  superuser: 'admin',
  admin: 'admin',
  supplier_admin: 'proveedor',
  supplier_operator: 'proveedor',
  buyer_admin: 'comprador',
  buyer_operator: 'comprador',
};

const roleNames = (user: User | null | undefined): RoleName[] => {
  const roles = user?.roles;
  if (!Array.isArray(roles)) return [];

  return roles
    .map((role) => (typeof role === 'string' ? role : role?.name))
    .filter((name): name is RoleName => Boolean(name && name in AREA_BY_ROLE));
};

/** Area a la que pertenece el usuario, o null si no tiene un rol reconocido. */
export const getUserArea = (user: User | null | undefined): Area | null => {
  const [first] = roleNames(user);
  return first ? AREA_BY_ROLE[first] : null;
};

/** Comprueba si el usuario puede estar en un area. */
export const belongsToArea = (user: User | null | undefined, area: Area): boolean =>
  getUserArea(user) === area;

/* A donde cae cada quien al iniciar sesion, y que hace la raiz del sitio.
   Sin rol reconocido se queda en la portada publica: es preferible a mandarlo
   a un area donde la guarda lo va a rebotar. */
export const getHomePath = (user: User | null | undefined): string => {
  const area = getUserArea(user);
  return area ? `/${area}` : '/';
};
