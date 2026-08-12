'use client';

import type { ReactNode } from 'react';
import { Table } from 'reactstrap';

import { formatTaxId } from '../../lib/taxId';
import type { Organization } from '../../model/organization.types';
import StatusBadge from './StatusBadge';

/* Tabla comun a proveedores y compradores: las columnas salen de Organization,
   que es la tabla que ambos comparten en el backend. Lo que cambia entre las
   dos pantallas son las acciones, y por eso se reciben como render prop. */

interface OrganizationTableProps {
  organizations: Organization[];
  isLoading: boolean;
  emptyMessage: string;
  actions?: (organization: Organization) => ReactNode;
}

const OrganizationTable = ({
  organizations,
  isLoading,
  emptyMessage,
  actions,
}: OrganizationTableProps) => {
  if (isLoading) {
    return <p className='text-muted my-4'>Cargando...</p>;
  }

  if (organizations.length === 0) {
    return <p className='text-muted my-4'>{emptyMessage}</p>;
  }

  return (
    <Table responsive hover className='align-middle'>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Razón social</th>
          <th>NIT</th>
          <th>Ciudad</th>
          <th>Estado</th>
          {actions && <th className='text-end'>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {organizations.map((organization) => (
          <tr key={organization.id}>
            <td className='fw-semibold'>{organization.name}</td>
            <td>{organization.legalName}</td>
            <td>{formatTaxId(organization.taxId)}</td>
            <td>{organization.city ?? '—'}</td>
            <td>
              <StatusBadge status={organization.status} />
            </td>
            {actions && <td className='text-end'>{actions(organization)}</td>}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default OrganizationTable;
