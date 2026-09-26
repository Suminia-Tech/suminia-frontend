import { redirect } from 'next/navigation';

/* El personal interno no pertenece a ninguna empresa: no hay resumen de cuenta
   que dar, de modo que /admin/account entra directo al perfil. */
export default function CuentaPage() {
  redirect('/admin/account/profile');
}
