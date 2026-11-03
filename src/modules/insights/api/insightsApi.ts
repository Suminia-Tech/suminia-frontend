import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse } from '@/shared/api/types';

import type { Insights } from '../model/insights.types';

export const insightsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* Los pedidos mueven los indicadores: se invalida con la lista. */
    getInsights: builder.query<ApiResponse<Insights>, number>({
      query: (months) => ({ url: '/insights', params: { months } }),
      providesTags: [{ type: 'Order', id: 'LIST' }],
    }),
  }),
});

export const { useGetInsightsQuery } = insightsApi;
