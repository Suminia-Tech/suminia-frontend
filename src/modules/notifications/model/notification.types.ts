/* Contrato con el backend para los avisos de la campana. */

export type NotificationType =
  | 'DOCUMENT_UPLOADED'
  | 'DOCUMENT_APPROVED'
  | 'DOCUMENT_REJECTED'
  /* Lo que le pasa a un pedido, a su pago y a la plata que transfiere Suminia. */
  | 'ORDER_UPDATE'
  | 'PAYMENT_UPDATE'
  | 'PAYOUT_UPDATE';

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
  /* Las no leidas de todas, no solo de las que vienen. */
  unreadCount: number;
  /* Las que llegaron desde que abrio la campana: el numero que lleva encima.
     Abrirla lo pone en cero; cada aviso sigue resaltado hasta pulsarlo. */
  unseenCount: number;
}
