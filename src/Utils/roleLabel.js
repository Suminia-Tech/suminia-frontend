// Etiqueta legible del rol con el que se inicio sesion. Sirve para distinguir
// de un vistazo con que cuenta se esta navegando, algo necesario mientras se
// prueban en paralelo las cuentas de administrador y de operador.
// Los roles de marketplace incluyen el lado en el que opera la organizacion:
// sin eso, un supplier_admin y un buyer_admin se verian identicos y no se
// podrian distinguir al probar varias cuentas en paralelo.
const ROLE_LABELS = {
  superuser: 'Superusuario',
  admin: 'Administrador',
  supplier_admin: 'Administrador · Proveedor',
  supplier_operator: 'Operador · Proveedor',
  buyer_admin: 'Administrador · Comprador',
  buyer_operator: 'Operador · Comprador',
};

// Devuelve la etiqueta del primer rol reconocido del usuario, o null si no
// tiene ninguno o no esta mapeado.
export const getRoleLabel = (user) => {
  const roles = user?.roles;
  if (!Array.isArray(roles)) return null;

  for (const role of roles) {
    const name = typeof role === 'string' ? role : role?.name;
    if (name && ROLE_LABELS[name]) return ROLE_LABELS[name];
  }

  return null;
};

// "Mi cuenta (Administrador)" cuando hay rol conocido; "Mi cuenta" si no.
export const getAccountLabel = (user) => {
  const label = getRoleLabel(user);
  return label ? `Mi cuenta (${label})` : 'Mi cuenta';
};
