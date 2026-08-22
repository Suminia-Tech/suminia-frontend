'use client';

import { Button, Col, Container, Input, Row } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { hasPermission } from '@/shared/lib/permissions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import {
  useApproveSupplierMutation,
  useGetSuppliersQuery,
} from '../../api/suppliersApi';
import { canApprove } from '../../lib/organizationStatus';
import type { OrganizationStatus } from '../../model/organization.types';
import {
  setPage,
  setSearch,
  setStatusFilter,
} from '../../model/organizationsSlice';
import OrganizationTable from '../common/OrganizationTable';

const STATUS_OPTIONS: { value: OrganizationStatus | ''; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'ACTIVE', label: 'Activos' },
  { value: 'SUSPENDED', label: 'Suspendidos' },
  { value: 'REJECTED', label: 'Rechazados' },
];

export const SuppliersScreen = () => {
  const dispatch = useAppDispatch();
  const { search, status, page } = useAppSelector((state) => state.organizations);
  /* Los permisos vienen del login. El boton se oculta si no los tiene, pero
     quien decide de verdad es el backend: el PermissionGuard responde 403. */
  const permissions = useAppSelector((state) => state.auth.user?.permissions);

  const { data, isFetching, isError, error } = useGetSuppliersQuery({
    page,
    search: search || undefined,
    filter: status ? { status } : undefined,
    sort: 'createdAt',
    sortDirection: 'desc',
  });

  const [approveSupplier, { isLoading: isApproving }] = useApproveSupplierMutation();

  const suppliers = data?.data.data ?? [];
  const meta = data?.data.meta;
  const canApproveSuppliers = hasPermission(permissions, 'organization:approve');

  return (
    <section className='section-b-space'>
      <Container>
        <Row className='align-items-center mb-4'>
          <Col md='6'>
            <h2 className='mb-0'>Proveedores</h2>
            <p className='text-muted mb-0'>
              Laboratorios, fabricantes e importadores registrados en Suminia.
            </p>
          </Col>
          <Col md='3' className='mt-3 mt-md-0'>
            <Input
              type='search'
              placeholder='Buscar por nombre o NIT'
              value={search}
              onChange={(event) => dispatch(setSearch(event.target.value))}
            />
          </Col>
          <Col md='3' className='mt-3 mt-md-0'>
            <Input
              type='select'
              value={status}
              onChange={(event) =>
                dispatch(setStatusFilter(event.target.value as OrganizationStatus | ''))
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Input>
          </Col>
        </Row>

        {isError && (
          <p className='text-danger'>
            {extractErrorMessage(error, 'No se pudieron cargar los proveedores.')}
          </p>
        )}

        <OrganizationTable
          organizations={suppliers}
          isLoading={isFetching}
          detailBasePath='/suppliers'
          emptyMessage={
            search || status
              ? 'Ningún proveedor coincide con la búsqueda.'
              : 'Todavía no hay proveedores registrados.'
          }
          actions={(organization) =>
            canApproveSuppliers && canApprove(organization.status) ? (
              <Button
                size='sm'
                color='primary'
                disabled={isApproving}
                onClick={() => approveSupplier(organization.id)}
              >
                Aprobar
              </Button>
            ) : null
          }
        />

        {meta && meta.totalPages > 1 && (
          <div className='d-flex justify-content-between align-items-center mt-3'>
            <span className='text-muted'>
              Página {meta.page} de {meta.totalPages} · {meta.totalCount} proveedores
            </span>
            <div className='d-flex gap-2'>
              <Button
                size='sm'
                outline
                disabled={meta.page <= 1}
                onClick={() => dispatch(setPage(meta.page - 1))}
              >
                Anterior
              </Button>
              <Button
                size='sm'
                outline
                disabled={meta.page >= meta.totalPages}
                onClick={() => dispatch(setPage(meta.page + 1))}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default SuppliersScreen;
