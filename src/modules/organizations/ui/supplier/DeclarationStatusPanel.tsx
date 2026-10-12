'use client';

import Link from 'next/link';

import { formatDate } from '@/shared/lib/dates';
import { Panel } from '@/shared/ui';

import { DECLARATION_TITLE } from '../../lib/supplierDeclaration';
import type { Organization } from '../../model/organization.types';

/* La declaracion de autocontrol vista desde Mi empresa. El formulario vive en
   su propia pantalla —es largo y se firma aparte—, pero aqui es donde se busca
   lo legal de la empresa, y sin esta caja no habia forma de saber que existia
   salvo encontrarla en el menu.

   Dice en que punto esta y lleva a la pantalla; no repite el formulario. */
export const DeclarationStatusPanel = ({ organization }: { organization: Organization }) => {
  const declaration = organization.declaration;
  const pendiente = organization.status === 'PENDING';

  const estado = declaration
    ? `Enviada el ${formatDate(declaration.updatedAt)}.`
    : pendiente
      ? 'Todavía no la has enviado. Sin ella Suminia no puede aprobar tu empresa.'
      : 'No hay una declaración registrada: tu empresa se aprobó antes de que Suminia la pidiera.';

  return (
    <Panel
      title='Sistema de Autocontrol y Gestión de Riesgos LA/FT/FP y C/ST'
      description={`${DECLARATION_TITLE}, anteriormente SAGRILAFT: el origen de tus recursos, listas, personas expuestas políticamente y operaciones internacionales.`}
      warning={!declaration && pendiente ? 'Falta enviar la declaración.' : undefined}
      aside={
        <Link href='/supplier/account/declaration' className='btn btn-outline-secondary btn-sm'>
          {declaration || !pendiente ? 'Ver declaración' : 'Llenar declaración'}
        </Link>
      }
    >
      <p className='font-light mb-0'>{estado}</p>
    </Panel>
  );
};

export default DeclarationStatusPanel;
