import type { Metadata } from 'next';

import { RegisterSection } from '@/modules/auth';

export const metadata: Metadata = {
  title: 'Registrarse | Suminia',
  description: 'Registra tu empresa como comprador o proveedor en Suminia.',
};

export default function RegisterPage() {
  return <RegisterSection />;
}
