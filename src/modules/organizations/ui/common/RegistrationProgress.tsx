'use client';

import Link from 'next/link';
import { Briefcase, CheckCircle, ChevronRight, Circle, CreditCard, FileText, Users } from 'react-feather';
import type { Icon } from 'react-feather';

import type { OrganizationKind } from '../../hooks/useOrganizationAdmin';
import {
  COMPANY_SECTIONS,
  companyPath,
  type CompanySection,
} from '../../lib/companySections';
import type { Pending, PendingKey } from '../../lib/pendings';

/* El avance del registro: cada subseccion de Mi empresa como un paso, completo
   o pendiente, y el porcentaje de los completos.

   Sale de los mismos pendientes que marcan los paneles y el Resumen, de modo
   que la barra no puede decir "completo" de algo que el formulario señala como
   faltante. Un usuario nuevo ve de una vez cuanto le falta y donde: cada paso
   lleva a su pagina y, si esta pendiente, dice que falta. */

/* En que paso cae cada pendiente. */
const PASO_DE: Record<PendingKey, CompanySection> = {
  declaration: 'documentos',
  documents: 'documentos',
  electronicInvoicing: 'empresa',
  profile: 'empresa',
  city: 'empresa',
  contacts: 'contacto',
  orderEmails: 'contacto',
  bank: 'condiciones',
  buyerNature: 'perfil',
  buyerPayment: 'perfil',
};

const ICONO: Record<CompanySection, Icon> = {
  empresa: Briefcase,
  documentos: FileText,
  contacto: Users,
  condiciones: CreditCard,
  perfil: CreditCard,
};

/* El paso "Mi empresa" se llama por lo que contiene, no por la pagina. */
const TITULO: Partial<Record<CompanySection, string>> = { empresa: 'Datos generales' };

export const RegistrationProgress = ({
  kind,
  pendientes,
}: {
  kind: OrganizationKind;
  pendientes: Pending[];
}) => {
  const pasos = COMPANY_SECTIONS[kind].map((seccion) => {
    const faltan = pendientes.filter((p) => PASO_DE[p.key] === seccion.id);
    return { ...seccion, faltan, completo: faltan.length === 0 };
  });
  const completos = pasos.filter((p) => p.completo).length;
  const porcentaje = Math.round((completos / pasos.length) * 100);

  return (
    <div className='registration-progress'>
      <div className='registration-progress-head'>
        <strong>Progreso del registro</strong>
        <span>{porcentaje}%</span>
      </div>
      <div
        className='registration-progress-bar'
        role='progressbar'
        aria-valuenow={porcentaje}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label='Progreso del registro'
      >
        <span style={{ width: `${porcentaje}%` }} />
      </div>

      <ul className='registration-steps'>
        {pasos.map((paso) => {
          const Icono = ICONO[paso.id];
          return (
            <li key={paso.id}>
              <Link href={companyPath(kind, paso.id)} className={paso.completo ? 'is-done' : undefined}>
                <Icono size={18} className='registration-step-icon' />
                <span className='registration-step-text'>
                  <strong>{TITULO[paso.id] ?? paso.title}</strong>
                  <small className='font-light'>
                    {paso.completo ? paso.description : paso.faltan.map((f) => f.texto).join(' ')}
                  </small>
                </span>
                <span className='registration-step-state'>
                  {paso.completo ? <CheckCircle size={16} /> : <Circle size={16} />}
                  {paso.completo ? 'Completo' : 'Pendiente'}
                </span>
                <ChevronRight size={16} className='registration-step-go' />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RegistrationProgress;
