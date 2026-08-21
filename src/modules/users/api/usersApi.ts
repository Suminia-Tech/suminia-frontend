import { baseApi } from '@/shared/api/baseApi';

import type { TeamUser } from '../model/user.types';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface PaginatedData<T> {
  data: T[];
  meta: { page: number; limit: number; totalCount: number; totalPages: number };
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* El backend acota el listado a la organizacion del usuario autenticado,
       de modo que no hace falta enviar el id de la empresa. */
    getTeam: builder.query<ApiResponse<PaginatedData<TeamUser>>, void>({
      query: () => ({ url: '/users', params: { page: 1, limit: 50, sort: 'createdAt' } }),
      providesTags: ['User'],
    }),
  }),
});

export const { useGetTeamQuery } = usersApi;
