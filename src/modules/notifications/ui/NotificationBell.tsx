'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Bell } from 'react-feather';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';

import { useAppSelector } from '@/store/hooks';

import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useMarkNotificationsSeenMutation,
} from '../api/notificationsApi';
import { useNotificationStream } from '../hooks/useNotificationStream';
import { timeAgo } from '../lib/relativeTime';
import type { AppNotification } from '../model/notification.types';

/* Los avisos llegan en tiempo real por useNotificationStream. Esto es la red
   de seguridad por si la conexion se cae sin que el navegador se entere: una
   consulta cada dos minutos con la pestaña a la vista, y al volver a ella. */
const POLLING_MS = 120_000;

interface NotificationBellProps {
  /* "panel" va en la barra superior del proveedor y del personal interno;
     "store", en la cabecera de la tienda, junto al carrito del comprador. */
  variant: 'panel' | 'store';
}

/* La campana de arriba a la derecha: cuantos avisos hay sin leer y, al
   abrirla, los ultimos. Pulsar uno lo marca leido y lleva a donde se
   resuelve. */
export const NotificationBell = ({ variant }: NotificationBellProps) => {
  const router = useRouter();
  /* La sesion se lee del store y no de useAuth: un modulo no importa otro. */
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [open, setOpen] = useState(false);
  const skip = !hydrated || !isAuthenticated;
  const { data } = useGetNotificationsQuery(undefined, {
    skip,
    pollingInterval: POLLING_MS,
    skipPollingIfUnfocused: true,
    refetchOnFocus: true,
  });
  const [markSeen] = useMarkNotificationsSeenMutation();
  useNotificationStream(!skip);
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();

  if (skip) return null;

  const items = data?.data.items ?? [];
  const unread = data?.data.unreadCount ?? 0;
  /* El numero de la campana son las que no ha visto: abrirla lo pone en
     cero, como en cualquier red social. Las no leidas siguen resaltadas. */
  const unseen = data?.data.unseenCount ?? 0;

  const select = (notification: AppNotification) => {
    setOpen(false);
    if (!notification.readAt) markRead(notification.id);
    if (!notification.href) return;
    /* A un ancla de la misma pagina se va cambiando el ancla: la navegacion de
       Next no dispara `hashchange`, y la pantalla no se enteraria de que debe
       abrir otra pestaña. */
    const destino = new URL(notification.href, window.location.origin);
    if (destino.pathname === window.location.pathname && destino.hash) {
      window.location.assign(destino.hash);
      return;
    }
    router.push(notification.href);
  };

  return (
    <Dropdown
      tag={variant === 'store' ? 'li' : 'div'}
      className={`notification-bell is-${variant}`}
      isOpen={open}
      toggle={() => {
        if (!open && unseen > 0) markSeen();
        setOpen(!open);
      }}
    >
      <DropdownToggle
        tag='button'
        type='button'
        className={
          variant === 'store' ? 'btn btn-solid-default btn-spacing' : 'notification-bell-toggle'
        }
        aria-label={unseen === 0 ? 'Notificaciones' : `Notificaciones, ${unseen} nuevas`}
      >
        <Bell size={variant === 'store' ? undefined : 19} />
      </DropdownToggle>
      {/* Fuera del boton: `.btn` recorta con `overflow: hidden`, como en el
          carrito. */}
      {unseen > 0 && (
        <span className='notification-badge' aria-hidden='true'>
          {unseen > 99 ? '99+' : unseen}
        </span>
      )}

      <DropdownMenu end className='notification-menu'>
        <div className='notification-menu-head'>
          <strong>Notificaciones</strong>
          {unread > 0 && (
            <button type='button' onClick={() => markAllRead()}>
              Marcar todas como leídas
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className='notification-empty font-light'>No tienes notificaciones.</p>
        ) : (
          <div className='notification-list'>
            {items.map((notification) => (
              <button
                type='button'
                key={notification.id}
                className={`notification-item${notification.readAt ? '' : ' is-unread'}`}
                onClick={() => select(notification)}
              >
                <span className='notification-title'>{notification.title}</span>
                {notification.body && (
                  <span className='notification-body font-light'>{notification.body}</span>
                )}
                <span className='notification-time font-light'>
                  {timeAgo(notification.createdAt)}
                </span>
              </button>
            ))}
          </div>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default NotificationBell;
