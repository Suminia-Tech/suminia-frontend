'use client';

import { formatDate } from '@/shared/lib/dates';
import { Panel } from '@/shared/ui';

import { describeOperations } from '../../lib/supplierDeclaration';
import type { SupplierDeclaration } from '../../model/organization.types';

/* Lo que quedo firmado, para leer. Las declaraciones aceptadas se resumen en
   una linea con la fecha: repetir los cuatro parrafos no dice nada nuevo. */
const DeclarationSummaryPanel = ({
  declaration,
  title,
}: {
  declaration: SupplierDeclaration;
  title: string;
}) => (
  <Panel
    title={title}
    description={`Enviada el ${formatDate(declaration.updatedAt)}.`}
  >
    <ul className='data-list'>
      <li>
        <span className='font-light'>Declaraciones</span>
        <span>
          Origen lícito, uso lícito de recursos, listas y verificaciones, e información
          veraz: aceptadas el {formatDate(declaration.declarationsAcceptedAt)}
        </span>
      </li>
      <li>
        <span className='font-light'>Origen de fondos</span>
        <span>{declaration.fundsOrigin}</span>
      </li>
      <li>
        <span className='font-light'>PEP</span>
        <span>{declaration.isPep ? 'Sí' : 'No'}</span>
      </li>
      <li>
        <span className='font-light'>Operaciones internacionales</span>
        <span>
          {declaration.internationalOperations
            ? describeOperations(
                declaration.internationalOperationTypes,
                declaration.otherOperation,
              )
            : 'No'}
        </span>
      </li>
      {declaration.internationalOperations && (
        <>
          <li>
            <span className='font-light'>Países</span>
            <span>{declaration.operationCountries}</span>
          </li>
          <li>
            <span className='font-light'>Monedas</span>
            <span>{declaration.currencies.join(', ')}</span>
          </li>
        </>
      )}
      <li>
        <span className='font-light'>Tratamiento de datos</span>
        <span>Aceptado el {formatDate(declaration.dataPolicyAcceptedAt)}</span>
      </li>
      <li>
        <span className='font-light'>Comunicaciones de Suminia</span>
        <span>{declaration.marketingConsent ? 'Sí' : 'No'}</span>
      </li>
    </ul>
  </Panel>
);

export default DeclarationSummaryPanel;
