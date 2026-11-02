/* API publica del modulo. Nada fuera de modules/notifications debe importar
   rutas internas (../api, ../ui): solo lo que se exporta aqui. */

export { NotificationBell } from './ui/NotificationBell';

export type { AppNotification, NotificationType } from './model/notification.types';
