'use client';

import { useState } from 'react';
import { Search } from 'react-feather';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { PageHeader, Panel } from '@/shared/ui';
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
import RejectOrganizationModal from './RejectOrganizationModal';

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

  const { approve, reject, isBusy } = useOrganizationDecisions(kind);
  /* La empresa que se va a rechazar: el motivo se pide en un modal. */
  const [aRechazar, setARechazar] = useState<{ id: string; name: string } | null>(null);
  const [errorRechazo, setErrorRechazo] = useState<string | null>(null);

  const rechazar = async (reason: string) => {
    if (!aRechazar) return;
    setErrorRechazo(null);
    try {
      await reject({ id: aRechazar.id, reason }).unwrap();
      toast.success(`${aRechazar.name} rechazado. Le avisamos por correo.`);
      setARechazar(null);
    } catch (err) {
      setErrorRechazo(extractErrorMessage(err, 'No se pudo rechazar.'));
    }
  };

  const organizations = data?.data.data ?? [];
  const meta = data?.data.meta;
  const puedeDecidir = hasPermission(permissions, 'organization:approve');

  return (
    <>
      <PageHeader title={copy.plural} description={copy.descripcion} />

      <Panel className='panel-table'>
        {/* Los filtros dentro del panel y pegados a la tabla: gobiernan la
            lista, de modo que flotando encima se leerian como un bloque
            aparte. Es la misma barra que el panel de productos. */}
        <div className='catalog-toolbar'>
          <label className='catalog-search'>
            <Search size={16} />
            <input
              type='search'
              placeholder='Buscar por nombre o NIT'
              value={search}
              onChange={(event) => dispatch(setSearch(event.target.value))}
            />
          </label>

          <select
            className='filter-select'
            value={status}
            aria-label='Filtrar por estado'
            onChange={(event) =>
              dispatch(setStatusFilter(event.target.value as OrganizationStatus | ''))
            }
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {isError && (
          <div className='alert alert-danger m-3'>
            {extractErrorMessage(
              error,
              `No se pudieron cargar los ${copy.plural.toLowerCase()}.`,
            )}
          </div>
        )}

        <OrganizationTable
          organizations={organizations}
          isLoading={isFetching}
          detailBasePath={copy.basePath}
          emptyMessage={search || status ? copy.sinCoincidencias : copy.vacio}
          actions={(organization) =>
            puedeDecidir && canApprove(organization.status) ? (
              <div className='table-actions'>
                <Button
                  size='sm'
                  color='primary'
                  disabled={isBusy}
                  onClick={() => approve({ id: organization.id })}
                >
                  Aprobar
                </Button>
                <button
                  type='button'
                  className='btn btn-sm btn-outline-danger'
                  disabled={isBusy}
                  onClick={() => {
                    setErrorRechazo(null);
                    setARechazar({ id: organization.id, name: organization.name });
                  }}
                >
                  Rechazar
                </button>
              </div>
            ) : null
          }
        />

        {meta && meta.totalPages > 1 && (
          <div className='catalog-panel-foot'>
            <span className='font-light'>
              Página {meta.page} de {meta.totalPages} · {meta.totalCount}{' '}
              {copy.plural.toLowerCase()}
            </span>
            <div className='list-pagination'>
              <button
                type='button'
                className='btn btn-sm btn-outline-secondary'
                disabled={meta.page <= 1}
                onClick={() => dispatch(setPage(meta.page - 1))}
              >
                Anterior
              </button>
              <button
                type='button'
                className='btn btn-sm btn-outline-secondary'
                disabled={meta.page >= meta.totalPages}
                onClick={() => dispatch(setPage(meta.page + 1))}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </Panel>
      <RejectOrganizationModal
        organizationName={aRechazar?.name ?? null}
        noun={copy.singular}
        isLoading={isBusy}
        error={errorRechazo}
        onClose={() => setARechazar(null)}
        onConfirm={rechazar}
      />
    </>
  );
};

export default OrganizationsScreen;
