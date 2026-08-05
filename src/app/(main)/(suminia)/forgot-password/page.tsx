import type { Metadata } from 'next';

import { ForgotPasswordSection } from '@/modules/auth';

export const metadata: Metadata = {
  title: 'Olvidé mi contraseña | Suminia',
  description: 'Solicita un enlace para restablecer la contraseña de tu cuenta.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordSection />;
}
