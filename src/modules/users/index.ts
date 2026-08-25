/* API publica del modulo. Nada fuera de modules/users debe importar rutas
   internas (../model, ../api, ../ui): solo lo que se exporta aqui. */

export { MyTeamScreen } from './ui/MyTeamScreen';

export { useGetTeamQuery } from './api/usersApi';
export type { TeamUser, UserStatus } from './model/user.types';
