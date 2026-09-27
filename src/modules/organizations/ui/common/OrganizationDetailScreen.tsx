'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { AlertTriangle, ChevronLeft, FileText } from 'react-feather';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/dates';
import { PageHeader, Panel } from '@/shared/ui';
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

/* Ficha de una empresa para el personal interno de Suminia: lo que mando al
   registrarse y la decision sobre si puede operar. Sirve para los dos lados
   del marketplace; el tipo entra por parametro.

   Esta pantalla existe para decidir, de modo que se ordena para eso: a la
   izquierda lo que hay que leer, a la derecha el boton y en que va la
   solicitud. Antes era una lista de seis filas sobre el fondo gris, con los
   botones arriba a la derecha y sin decir nunca cuando se habia registrado la
   empresa.

   Lo que se revisa es solo lo que escribio la empresa: hoy el registro no pide
   ningun documento —ni camara de comercio ni RUT— y en la base no hay donde
   guardarlo. De ahi el aviso al revisor: no es que falten por cargar, es que no
   se piden. Cuando se pidan, van en el panel de la izquierda.

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

  const datos = [
    { label: 'NIT', value: formatTaxId(organization.taxId) },
    { label: 'Razón social', value: organization.legalName },
    { label: 'Nombre comercial', value: organization.name },
    { label: 'Correo de contacto', value: organization.email },
    { label: 'Teléfono', value: organization.phone },
    { label: 'Ciudad', value: organization.city },
    { label: 'Dirección', value: organization.address },
  ];

  /* Lo que la empresa dejo en blanco. Son campos opcionales en el registro, de
     modo que su ausencia no es un error; pero quien decide si la empresa puede
     operar merece verlo dicho, no deducirlo de una raya. */
  const sinLlenar = datos
    .filter((campo) => !campo.value)
    .map((campo) => campo.label.toLowerCase());

  const esProveedor = kind === 'supplier';
  const tieneCuenta = Boolean(
    organization.bankName && organization.bankAccountNumber,
  );

  const decidiendo = organization.status === 'PENDING';

  const botones = [
    available.includes('approve') && {
      texto: 'Aprobar',
      clase: 'btn btn-primary',
      accion: () =>
        run(
          () => approve(organization.id).unwrap(),
          `${nombre} aprobado`,
          'No se pudo aprobar.',
        ),
    },
    available.includes('reject') && {
      texto: 'Rechazar',
      clase: 'btn btn-outline-danger',
      accion: () =>
        run(
          () => reject(organization.id).unwrap(),
          `${nombre} rechazado`,
          'No se pudo rechazar.',
        ),
    },
    available.includes('suspend') && {
      texto: 'Suspender',
      clase: 'btn btn-outline-danger',
      accion: () =>
        run(
          () => suspend(organization.id).unwrap(),
          `${nombre} suspendido`,
          'No se pudo suspender.',
        ),
    },
    available.includes('reactivate') && {
      texto: 'Reactivar',
      clase: 'btn btn-primary',
      accion: () =>
        run(
          () => reactivate(organization.id).unwrap(),
          `${nombre} reactivado`,
          'No se pudo reactivar.',
        ),
    },
  ].filter(
    (b): b is { texto: string; clase: string; accion: () => Promise<void> } =>
      Boolean(b),
  );

  return (
    <>
      <Link
        href={copy.basePath}
        className='font-light d-inline-flex align-items-center gap-1 mb-3'
      >
        <ChevronLeft size={16} />
        {copy.plural}
      </Link>

      <div className='order-head'>
        <div>
          <h1>{organization.name}</h1>
          <p className='font-light mb-0'>
            {nombre} · registrado el {formatDate(organization.createdAt)}
          </p>
        </div>
        <StatusBadge status={organization.status} />
      </div>

      {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}

      <div className='order-layout'>
        <div className='order-main'>
          <Panel
            title='Lo que registró la empresa'
            description={
              decidiendo
                ? 'Es lo único que hay para revisar: Suminia todavía no pide documentos al registrarse.'
                : undefined
            }
          >
            {/* El aviso solo mientras se decide: despues de aprobada, que el
                telefono este vacio ya no cambia nada. */}
            {decidiendo && sinLlenar.length > 0 && (
              <p className='review-missing'>
                <AlertTriangle size={16} />
                Dejó sin llenar {sinLlenar.join(', ')}. Son campos opcionales
                del registro.
              </p>
            )}

            <ul className='data-list'>
              {datos.map(({ label, value }) => (
                <li key={label}>
                  <span className='font-light'>{label}</span>
                  <span>{value ?? '—'}</span>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Del proveedor, y solo si las registro: son datos que se llenan
              despues de aprobado, de modo que en una solicitud nueva estaran
              vacios y un panel en blanco no dice nada. */}
          {esProveedor && (organization.minOrderValue !== null || tieneCuenta) && (
            <Panel
              title='Condiciones comerciales'
              description='Las registra el proveedor desde su panel, después de quedar aprobado.'
            >
              <ul className='data-list'>
                <li>
                  <span className='font-light'>Pedido mínimo</span>
                  <span>
                    {organization.minOrderValue !== null
                      ? new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          maximumFractionDigits: 0,
                        }).format(organization.minOrderValue)
                      : 'Sin mínimo'}
                  </span>
                </li>
                {tieneCuenta && (
                  <>
                    <li>
                      <span className='font-light'>Banco</span>
                      <span>{organization.bankName}</span>
                    </li>
                    <li>
                      <span className='font-light'>Cuenta</span>
                      <span>
                        {organization.bankAccountType === 'AHORROS'
                          ? 'Ahorros'
                          : 'Corriente'}{' '}
                        {organization.bankAccountNumber}
                      </span>
                    </li>
                    <li>
                      <span className='font-light'>Titular</span>
                      <span>{organization.bankAccountHolder}</span>
                    </li>
                    <li>
                      <span className='font-light'>Documento del titular</span>
                      <span>{organization.bankAccountHolderTaxId}</span>
                    </li>
                  </>
                )}
              </ul>
            </Panel>
          )}
        </div>

        <aside className='order-side'>
          {canDecide && botones.length > 0 && (
            <Panel className='order-next'>
              <div className='order-actions'>
                {botones.map((boton) => (
                  <button
                    key={boton.texto}
                    type='button'
                    className={boton.clase}
                    disabled={isBusy}
                    onClick={boton.accion}
                  >
                    {boton.texto}
                  </button>
                ))}
              </div>
            </Panel>
          )}

          <Panel title='La solicitud'>
            <ul className='data-list is-single'>
              <li>
                <span className='font-light'>Registrada</span>
                <span>{formatDate(organization.createdAt)}</span>
              </li>
              {organization.approvedAt && (
                <li>
                  <span className='font-light'>Aprobada</span>
                  <span>{formatDate(organization.approvedAt)}</span>
                </li>
              )}
            </ul>
          </Panel>

          {/* Se dice que no hay documentos, en vez de no decir nada: un revisor
              que no los encuentra se queda buscando donde estan. */}
          <Panel title='Documentos'>
            <p className='review-note'>
              <FileText size={16} />
              El registro no pide documentos todavía. Para verificar el NIT y la
              razón social hay que consultarlos por fuera de Suminia.
            </p>
          </Panel>
        </aside>
      </div>
    </>
  );
};

export default OrganizationDetailScreen;
