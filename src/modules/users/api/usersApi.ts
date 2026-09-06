import { baseApi } from '@/shared/api/baseApi';

import type {
  CreateMemberRequest,
  TeamUser,
  UpdateMemberRequest,
} from '../model/user.types';

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
      providesTags: [{ type: 'User', id: 'LIST' }],
    }),

    createMember: builder.mutation<ApiResponse<TeamUser>, CreateMemberRequest>({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateMember: builder.mutation<
      ApiResponse<TeamUser>,
      { id: string; data: UpdateMemberRequest }
    >({
      query: ({ id, data }) => ({ url: `/users/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    deleteMember: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTeamQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} = usersApi;
