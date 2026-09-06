import { redirect } from 'next/navigation';

/* Sin pantalla de resumen todavia: el backend no expone /buyers, de modo que no
   hay datos de empresa que mostrar. Entra por el perfil. */
export default function CuentaPage() {
  redirect('/buyer/account/profile');
}
