import type { Metadata } from 'next';

import AdminSummary from './AdminSummary';

export const metadata: Metadata = {
  title: 'Resumen',
  description: 'Lo que espera una decisión y lo que se ha movido en Suminia.',
};

/* Entraba directo al listado de proveedores porque no habia resumen que dar.
   Ahora lo hay: lo primero que necesita el personal interno es saber si algo
   espera su decision. */
export default function AdminPage() {
  return <AdminSummary />;
}
