import { redirect } from 'next/navigation';

/* El personal interno no pertenece a ninguna empresa: no hay resumen que dar. */
export default function CuentaPage() {
  redirect('/admin/account/profile');
}
