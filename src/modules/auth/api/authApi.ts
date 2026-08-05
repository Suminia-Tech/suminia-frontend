import { baseApi } from '@/shared/api/baseApi';
import { tokenStorage } from '@/shared/lib/tokenStorage';

import { setCredentials } from '../model/authSlice';
import type {
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  RegisterRequest,
  ResetPasswordRequest,
} from '../model/auth.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        // Persistir la sesion y propagarla al store para que el header reaccione
        tokenStorage.save(data.data);
        dispatch(setCredentials(data.data.user));
      },
      invalidatesTags: ['Auth', 'Profile'],
    }),

    register: builder.mutation<void, RegisterRequest>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),

    forgotPassword: builder.mutation<void, string>({
      query: (email) => ({ url: '/auth/forgot-password', method: 'POST', body: { email } }),
    }),

    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),

    validateResetToken: builder.mutation<void, string>({
      query: (token) => ({
        url: '/auth/validate-reset-password-token',
        method: 'POST',
        body: { token },
      }),
    }),

    verifyEmail: builder.mutation<void, string>({
      query: (token) => ({ url: '/auth/verify-email', method: 'POST', body: { token } }),
    }),

    resendVerification: builder.mutation<void, string>({
      query: (email) => ({
        url: '/auth/resend-verification-email',
        method: 'POST',
        body: { email },
      }),
    }),

    getProfile: builder.query<ProfileResponse, void>({
      query: () => '/auth/profile',
      providesTags: ['Profile'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useValidateResetTokenMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useGetProfileQuery,
} = authApi;
