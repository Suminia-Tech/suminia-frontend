import { redirect } from 'next/navigation';

/* Lo primero que busca quien entra aqui es en que va su solicitud, sobre todo
   mientras no esta aprobada. */
export default function CuentaPage() {
  redirect('/buyer/account/company');
}
