'use client';

import { formatDate } from '@/shared/lib/dates';
import { Panel } from '@/shared/ui';

import { describeOperations } from '../../lib/supplierDeclaration';
import type { IdentificationType, SupplierDeclaration } from '../../model/organization.types';

const ID_LABEL: Record<IdentificationType, string> = {
  CC: 'CC',
  CE: 'CE',
  NIT: 'NIT',
  PASSPORT: 'Pasaporte',
  OTHER: 'Otro',
};

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

    {/* Quien esta detras de la empresa. Si el servidor no manda el dato —uno
        anterior a este cambio— no se afirma nada: la seccion no aparece. */}
    {declaration.beneficialOwners !== undefined && (
      <>
        <h3 className='order-subhead mt-4'>Accionistas y beneficiarios finales</h3>
        {declaration.beneficialOwners.length > 0 ? (
          <div className='catalog-table-scroll'>
            <table className='catalog-table'>
              <thead>
                <tr>
                  <th>Identificación</th>
                  <th>Nombre</th>
                  <th>Accionista de</th>
                  <th className='num'>% participación</th>
                </tr>
              </thead>
              <tbody>
                {declaration.beneficialOwners.map((owner, index) => (
                  <tr key={`${owner.idNumber}-${index}`}>
                    <td>
                      {ID_LABEL[owner.idType]} {owner.idNumber}
                    </td>
                    <td>{owner.name}</td>
                    <td>
                      {owner.companyName}
                      <span className='d-block font-light'>NIT {owner.companyTaxId}</span>
                    </td>
                    <td className='num'>{String(owner.ownership).replace('.', ',')}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='review-missing mb-0'>
            Todavía no hay accionistas ni beneficiarios finales registrados. Se agregan desde la
            declaración.
          </p>
        )}
      </>
    )}
  </Panel>
);

export default DeclarationSummaryPanel;
