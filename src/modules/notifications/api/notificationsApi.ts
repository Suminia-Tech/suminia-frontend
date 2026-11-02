import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse } from '@/shared/api/types';

import type { NotificationPage } from '../model/notification.types';

/* Los avisos de quien tiene la sesion abierta. El backend los acota al
   usuario del token: no hay id que pasar. */
export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<ApiResponse<NotificationPage>, void>({
      query: () => '/notifications?limit=20',
      providesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    markNotificationRead: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PATCH' }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    markAllNotificationsRead: builder.mutation<ApiResponse<null>, void>({
      query: () => ({ url: '/notifications/read-all', method: 'PATCH' }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;
