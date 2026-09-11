'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { Col, Container, Row } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { hasPermission } from '@/shared/lib/permissions';
import { useAppSelector } from '@/store/hooks';

import {
  KIND_COPY,
  useOrganizationDecisions,
  useOrganizationDetail,
  type OrganizationKind,
} from '../../hooks/useOrganizationAdmin';
import { formatTaxId } from '../../lib/taxId';
import type { OrganizationStatus } from '../../model/organization.types';
import StatusBadge from './StatusBadge';

/* Ficha de una empresa para el personal interno de Suminia: sus datos y las
   decisiones sobre si puede operar. Sirve para los dos lados del marketplace;
   el tipo entra por parametro.

   Las acciones disponibles dependen del estado actual, con las mismas reglas
   que valida el backend: aprobar o rechazar solo tienen sentido sobre una
   solicitud sin revisar, suspender sobre una empresa que ya opera, y reactivar
   sobre una detenida. */
const ACTIONS_BY_STATUS: Record<OrganizationStatus, string[]> = {
  PENDING: ['approve', 'reject'],
  ACTIVE: ['suspend'],
  SUSPENDED: ['reactivate'],
  REJECTED: ['reactivate'],
};

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

type Props = { kind: OrganizationKind; organizationId: string };

export const OrganizationDetailScreen = ({ kind, organizationId }: Props) => {
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const copy = KIND_COPY[kind];
  const nombre = capitalizar(copy.singular);

  const { data, isLoading, isError, error } = useOrganizationDetail(
    kind,
    organizationId,
    { skip: !hydrated },
  );

  const { approve, reject, suspend, reactivate, isBusy } =
    useOrganizationDecisions(kind);

  const canDecide = hasPermission(permissions, 'organization:approve');

  if (!hydrated || isLoading) {
    return <p className='font-light'>Cargando...</p>;
  }

  if (isError || !data) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, `No se pudo cargar el ${copy.singular}.`)}
      </div>
    );
  }

  const organization = data.data;
  const available = ACTIONS_BY_STATUS[organization.status] ?? [];

  const run = async (
    action: () => Promise<unknown>,
    successMessage: string,
    fallback: string,
  ) => {
    setErrorMessage(null);
    try {
      await action();
      toast.success(successMessage);
    } catch (err) {
      setErrorMessage(extractErrorMessage(err, fallback));
    }
  };

  const fields = [
    { label: 'NIT', value: formatTaxId(organization.taxId) },
    { label: 'Razón social', value: organization.legalName },
    { label: 'Correo de contacto', value: organization.email },
    { label: 'Teléfono', value: organization.phone },
    { label: 'Ciudad', value: organization.city },
    { label: 'Dirección', value: organization.address },
  ];

  return (
    <section className='section-b-space'>
      <Container>
        <Row className='mb-4 align-items-center'>
          <Col md='8'>
            <h2 className='mb-1'>{organization.name}</h2>
            <StatusBadge status={organization.status} />
          </Col>
          <Col md='4' className='text-md-end mt-3 mt-md-0'>
            {canDecide && (
              <div className='d-flex gap-2 justify-content-md-end'>
                {available.includes('approve') && (
                  <button
                    type='button'
                    className='btn btn-primary btn-sm'
                    disabled={isBusy}
                    onClick={() =>
                      run(
                        () => approve(organization.id).unwrap(),
                        `${nombre} aprobado`,
                        'No se pudo aprobar.',
                      )
                    }
                  >
                    Aprobar
                  </button>
                )}
                {available.includes('reject') && (
                  <button
                    type='button'
                    className='btn btn-outline-danger btn-sm'
                    disabled={isBusy}
                    onClick={() =>
                      run(
                        () => reject(organization.id).unwrap(),
                        `${nombre} rechazado`,
                        'No se pudo rechazar.',
                      )
                    }
                  >
                    Rechazar
                  </button>
                )}
                {available.includes('suspend') && (
                  <button
                    type='button'
                    className='btn btn-outline-danger btn-sm'
                    disabled={isBusy}
                    onClick={() =>
                      run(
                        () => suspend(organization.id).unwrap(),
                        `${nombre} suspendido`,
                        'No se pudo suspender.',
                      )
                    }
                  >
                    Suspender
                  </button>
                )}
                {available.includes('reactivate') && (
                  <button
                    type='button'
                    className='btn btn-primary btn-sm'
                    disabled={isBusy}
                    onClick={() =>
                      run(
                        () => reactivate(organization.id).unwrap(),
                        `${nombre} reactivado`,
                        'No se pudo reactivar.',
                      )
                    }
                  >
                    Reactivar
                  </button>
                )}
              </div>
            )}
          </Col>
        </Row>

        {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}

        <div className='dashboard-profile'>
          <ul className='dash-profile'>
            {fields.map(({ label, value }) => (
              <li key={label}>
                <div className='left'>
                  <h6 className='font-light'>{label}</h6>
                </div>
                <div className='right'>
                  <h6>{value ?? '—'}</h6>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
};

export default OrganizationDetailScreen;
