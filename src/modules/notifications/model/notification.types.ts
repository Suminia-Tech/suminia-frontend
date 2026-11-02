/* Contrato con el backend para los avisos de la campana. */

export type NotificationType = 'DOCUMENT_UPLOADED' | 'DOCUMENT_APPROVED' | 'DOCUMENT_REJECTED';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  /* Ruta del frontend a la que lleva al pulsarla. */
  href: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationPage {
  items: AppNotification[];
  /* Las no leidas de todas, no solo de las que vienen: el numero de la
     campana. */
  unreadCount: number;
}
