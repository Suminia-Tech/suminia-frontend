/* API publica del feature. Nada fuera de features/auth debe importar rutas
   internas (../model, ../api, ../ui): solo lo que se exporta aqui. */

export { AuthInitializer } from './ui/AuthInitializer';
export { default as LoginModal } from './ui/LoginModal';
export { default as RegisterSection } from './ui/RegisterSection';
export { default as ForgotPasswordSection } from './ui/ForgotPasswordSection';
export { ResetPasswordScreen } from './ui/ResetPasswordScreen';
export { VerifyEmailScreen } from './ui/VerifyEmailScreen';

export { useAuth } from './hooks/useAuth';
export { getAccountLabel, getRoleLabel } from './lib/roleLabel';

export { useGetProfileQuery } from './api/authApi';
export { default as authReducer } from './model/authSlice';

export type { OrganizationType, Role, RoleName, User } from './model/auth.types';
