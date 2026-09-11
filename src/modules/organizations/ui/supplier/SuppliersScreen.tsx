'use client';

import OrganizationsScreen from '../common/OrganizationsScreen';

/* El listado es el mismo que el de compradores: administrarlas es la misma
   tarea. Lo que cambia entra por el tipo. */
export const SuppliersScreen = () => <OrganizationsScreen kind='supplier' />;

export default SuppliersScreen;
