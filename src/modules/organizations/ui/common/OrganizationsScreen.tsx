'use client';

import { Button, Col, Container, Input, Row } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { hasPermission } from '@/shared/lib/permissions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import {
  KIND_COPY,
  useOrganizationDecisions,
  useOrganizationList,
  type OrganizationKind,
} from '../../hooks/useOrganizationAdmin';
import { canApprove } from '../../lib/organizationStatus';
import type { OrganizationStatus } from '../../model/organization.types';
import {
  setPage,
  setSearch,
  setStatusFilter,
} from '../../model/organizationsSlice';
import OrganizationTable from './OrganizationTable';

/* El listado que usa el personal de Suminia para revisar empresas, sea de un
   lado del marketplace o del otro.

   Es una sola pantalla y no dos porque administrarlas es lo mismo: el mismo
   listado, los mismos filtros y las mismas decisiones sobre si pueden operar.
   Lo que cambia —a que endpoint va y como se llama en pantalla— entra por
   parametro. Con dos copias, el dia que se añada una columna habria que
   acordarse de las dos. */

const STATUS_OPTIONS: { value: OrganizationStatus | ''; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'ACTIVE', label: 'Activos' },
  { value: 'SUSPENDED', label: 'Suspendidos' },
  { value: 'REJECTED', label: 'Rechazados' },
];

export const OrganizationsScreen = ({ kind }: { kind: OrganizationKind }) => {
  const dispatch = useAppDispatch();
  const { search, status, page } = useAppSelector((state) => state.organizations);
  /* Los permisos vienen del login. El boton se oculta si no los tiene, pero
     quien decide de verdad es el backend: el PermissionGuard responde 403. */
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  const copy = KIND_COPY[kind];

  const { data, isFetching, isError, error } = useOrganizationList(kind, {
    page,
    search: search || undefined,
    filter: status ? { status } : undefined,
    sort: 'createdAt',
    sortDirection: 'desc',
  });

  const { approve, isBusy } = useOrganizationDecisions(kind);

  const organizations = data?.data.data ?? [];
  const meta = data?.data.meta;
  const puedeDecidir = hasPermission(permissions, 'organization:approve');

  return (
    <section className='section-b-space'>
      <Container>
        <Row className='align-items-center mb-4'>
          <Col md='6'>
            <h2 className='mb-0'>{copy.plural}</h2>
            <p className='text-muted mb-0'>{copy.descripcion}</p>
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
            {extractErrorMessage(
              error,
              `No se pudieron cargar los ${copy.plural.toLowerCase()}.`,
            )}
          </p>
        )}

        <OrganizationTable
          organizations={organizations}
          isLoading={isFetching}
          detailBasePath={copy.basePath}
          emptyMessage={search || status ? copy.sinCoincidencias : copy.vacio}
          actions={(organization) =>
            puedeDecidir && canApprove(organization.status) ? (
              <Button
                size='sm'
                color='primary'
                disabled={isBusy}
                onClick={() => approve(organization.id)}
              >
                Aprobar
              </Button>
            ) : null
          }
        />

        {meta && meta.totalPages > 1 && (
          <div className='d-flex justify-content-between align-items-center mt-3'>
            <span className='text-muted'>
              Página {meta.page} de {meta.totalPages} · {meta.totalCount}{' '}
              {copy.plural.toLowerCase()}
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

export default OrganizationsScreen;
