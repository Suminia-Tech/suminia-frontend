'use client';

import { useState } from 'react';
import { AlertTriangle } from 'react-feather';
import { toast } from 'react-toastify';

import { useScrollToHash } from '@/shared/hooks/useScrollToHash';
import { extractErrorMessage } from '@/shared/lib/apiError';
import { PageHeader, Panel } from '@/shared/ui';
import { formatDate } from '@/shared/lib/dates';
import { hasPermission } from '@/shared/lib/permissions';
import { useAppSelector } from '@/store/hooks';

import {
  useOrganizationDetail,
  useOrganizationUpdate,
  type OrganizationKind,
} from '../../hooks/useOrganizationAdmin';
import {
  describeActivities,
  describeExporter,
  describeProductLines,
} from '../../lib/commercialProfile';
import { avisoDe, buyerPendings, SECTION, supplierPendings } from '../../lib/pendings';
import type { ContactArea, OrganizationStatus } from '../../model/organization.types';
import LegalDocumentsPanel from './LegalDocumentsPanel';
import OrganizationForm, { type OrganizationFormValues } from './OrganizationForm';
import { isContactEmpty } from './SupplierContactsFields';
import StatusBadge from './StatusBadge';
import { DeclarationStatusPanel } from '../supplier/DeclarationStatusPanel';

/* Los datos de la propia empresa y en que va su solicitud.

   El id sale de la sesion y no de la URL: cada quien solo puede ver la suya, y
   el backend lo verifica ademas por su cuenta.

   Es la misma pantalla para los dos lados del marketplace —se registran igual y
   se aprueban igual— y lo unico que cambia es a que endpoint va.

   El bloque de estado existe porque la franja de arriba dice "estamos
   verificando tu empresa" y ahi se acababa la historia: no habia donde ver que
   se mando, ni cuando, ni que falta. Una solicitud que no se puede consultar se
   parece demasiado a una que se perdio. */

const EXPLICACION: Record<OrganizationStatus, string | null> = {
  PENDING:
    'El equipo de Suminia revisa a mano los datos de cada empresa. Te avisamos por correo en cuanto quede aprobada; mientras tanto puedes navegar el catálogo, pero los precios no se muestran.',
  ACTIVE: null,
  SUSPENDED:
    'Tu empresa está suspendida: puedes entrar y consultar el catálogo, pero no ver precios ni comprar. Escríbenos para saber que hace falta para reactivarla.',
  REJECTED:
    'Tu solicitud no fue aprobada. Si crees que se trata de un error, escríbenos y la revisamos de nuevo.',
};

const CLASE_AVISO: Record<OrganizationStatus, string> = {
  PENDING: 'alert alert-warning',
  ACTIVE: 'alert alert-success',
  SUSPENDED: 'alert alert-danger',
  REJECTED: 'alert alert-danger',
};

export const MyCompanyScreen = ({ kind }: { kind: OrganizationKind }) => {
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const organizationId = user?.organizationId ?? null;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useOrganizationDetail(
    kind,
    organizationId as string,
    { skip: !organizationId },
  );
  const { update, isSaving } = useOrganizationUpdate(kind);

  const canEdit = hasPermission(user?.permissions, 'organization:update');
  const organization = data?.data;

  /* Los enlaces del Resumen traen el panel en el ancla —#cuenta-pagos— y aqui
     se llega a el en cuanto los datos estan pintados. */
  useScrollToHash(Boolean(organization));

  const handleSubmit = async (values: OrganizationFormValues) => {
    if (!organizationId || !organization) return;
    setErrorMessage(null);

    try {
      await update({
        id: organizationId,
        data: {
          name: values.name.trim(),
          /* Solo del proveedor, y vacio significa quitarlo: por eso null
             explicito y no omitir el campo.

             Los cinco de la cuenta van siempre juntos, tal y como los exige el
             backend: o los cinco con valor, o los cinco nulos. */
          ...(kind === 'supplier'
            ? {
                minOrderValue:
                  values.minOrderValue.trim() === ''
                    ? null
                    : Number(values.minOrderValue),
                deliveryDaysMin:
                  values.deliveryDaysMin.trim() === '' ? null : Number(values.deliveryDaysMin),
                deliveryDaysMax:
                  values.deliveryDaysMax.trim() === '' ? null : Number(values.deliveryDaysMax),
                bankName: values.bankName.trim() || null,
                bankAccountType:
                  (values.bankAccountType.trim() as
                    | 'AHORROS'
                    | 'CORRIENTE'
                    | '') || null,
                bankAccountNumber: values.bankAccountNumber.trim() || null,
                /* Titular y NIT son los de la empresa: el backend los fija desde
                   los datos legales, y aqui se mandan igual para que la cuenta
                   viaje entera. Sin banco no hay cuenta, ni titular. */
                bankAccountHolder: values.bankName.trim() ? organization.legalName : null,
                bankAccountHolderTaxId: values.bankName.trim() ? organization.taxId : null,
                ...(values.earlyPayment
                  ? {
                      offersEarlyPaymentDiscount: values.earlyPayment === 'yes',
                      earlyPaymentDiscountRate:
                        values.earlyPayment === 'yes' ? Number(values.earlyPaymentRate) : null,
                      earlyPaymentDiscountDays:
                        values.earlyPayment === 'yes' ? Number(values.earlyPaymentDays) : null,
                    }
                  : {}),
                activities: values.activities,
                productLines: values.productLines,
                exporter:
                  values.exporter === '' ? null : values.exporter === 'yes',
                /* Los contactos en blanco no viajan: el backend reemplaza la
                   lista entera, y lo que no llega se borra. El formulario ya
                   comprobo que los demas traen area. */
                contacts: values.contacts
                  .filter((contact) => !isContactEmpty(contact) && contact.area !== '')
                  .map((contact) => ({
                    area: contact.area as ContactArea,
                    name: contact.name.trim(),
                    position: contact.position.trim() || null,
                    email: contact.email.trim(),
                    phone: contact.phone.trim() || null,
                  })),
                orderEmails: values.orderEmails
                  .map((email) => email.trim())
                  .filter(Boolean),
              }
            : /* El proveedor ya no edita correo ni telefono generales: los
                 reemplazan los contactos por area. El comprador si. */
              {
                email: values.email.trim(),
                phone: values.phone.trim() || null,
                /* El perfil viaja entero; si no se eligio nada, no viaja y
                   queda como estaba. */
                ...(values.legalNature && values.buyerActivity
                  ? {
                      legalNature: values.legalNature,
                      buyerActivity: values.buyerActivity,
                      ipsSector: values.ipsSector || null,
                      activityOther: values.activityOther.trim() || null,
                    }
                  : {}),
                bankName: values.bankName.trim() || null,
                bankAccountNumber: values.bankAccountNumber.trim() || null,
              }),
          // Cadena vacia significa "sin dato": el backend acepta null para
          // limpiar el campo, pero rechaza "" en los que valida formato.
          address: values.address.trim() || null,
          city: values.city.trim() || null,
        },
      }).unwrap();
      toast.success('Datos actualizados');
    } catch (err) {
      setErrorMessage(extractErrorMessage(err, 'No se pudieron guardar los cambios.'));
    }
  };

  if (!hydrated || isLoading) {
    return <p className='font-light'>Cargando...</p>;
  }

  /* El personal interno de Suminia no pertenece a ninguna organizacion, de modo
     que esta pantalla no aplica para ellos. */
  if (!organizationId) {
    return (
      <div className='alert alert-secondary'>
        Tu cuenta no está asociada a ninguna empresa.
      </div>
    );
  }

  if (isError || !organization) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudieron cargar los datos de la empresa.')}
      </div>
    );
  }

  const explicacion = EXPLICACION[organization.status];
  /* Lo que falta llenar, con el panel donde se llena. El formulario marca esos
     paneles; al comprador ademas se le lista arriba, porque no tiene Resumen. */
  const pendientes =
    kind === 'buyer' ? buyerPendings(organization) : supplierPendings(organization);
  const enviada = formatDate(organization.createdAt);
  const aprobada = formatDate(organization.approvedAt);

  const readOnlyFields = [
    { label: 'Razón social', value: organization.legalName },
    { label: 'Ciudad', value: organization.city },
    ...(kind === 'supplier'
      ? [
          { label: 'Actividades', value: describeActivities(organization.activities) },
          {
            label: 'Categorías que comercializa',
            value: describeProductLines(organization.productLines),
          },
          { label: 'Exporta', value: describeExporter(organization.exporter) },
        ]
      : [
          { label: 'Correo de contacto', value: organization.email },
          { label: 'Teléfono', value: organization.phone },
        ]),
    { label: 'Dirección', value: organization.address },
  ];

  return (
    <>
      {/* El titulo es el de la seccion, no el nombre de la empresa. Antes el
          `h1` decia "Distribuidora Medica del Norte" y no habia forma de saber,
          mirando la pantalla, que era "Mi empresa" y no "Mi perfil". El nombre
          pasa a encabezar el panel de estado, que es de lo que habla. */}
      <PageHeader
        title='Mi empresa'
        description='Información empresarial y estado de tu solicitud.'
      />

      <Panel
        title={organization.name}
        aside={<StatusBadge status={organization.status} />}
      >
        {explicacion && (
          <div className={CLASE_AVISO[organization.status]}>{explicacion}</div>
        )}

        {/* Lo que le falta al comprador para que lo aprueben, dicho antes de
            que lo descubra esperando: Suminia no puede aprobarlo sin ello. */}
        {kind === 'buyer' && organization.status === 'PENDING' && pendientes.length > 0 && (
          <ul className='summary-todo'>
            {pendientes.map((pendiente) => (
              <li key={pendiente.key}>
                <AlertTriangle size={17} />
                <span>{pendiente.texto}</span>
                <a href={`#${pendiente.href.split('#')[1]}`}>{pendiente.enlace}</a>
              </li>
            ))}
          </ul>
        )}

        {/* El estado no se repite aqui: ya esta en la etiqueta de al lado del
            nombre, y el aviso de arriba explica lo que significa. */}
        {(enviada || aprobada) && (
          <ul className='data-list'>
            {enviada && (
              <li>
                <span className='font-light'>Solicitud enviada</span>
                <span>{enviada}</span>
              </li>
            )}
            {aprobada && (
              <li>
                <span className='font-light'>Aprobada el</span>
                <span>{aprobada}</span>
              </li>
            )}
          </ul>
        )}
      </Panel>

      {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}

      {canEdit ? (
        <OrganizationForm
          key={organization.updatedAt}
          organization={organization}
          isSaving={isSaving}
          onSubmit={handleSubmit}
          showSupplierFields={kind === 'supplier'}
          pendientes={pendientes}
          legalDocuments={
            <>
              <LegalDocumentsPanel
                id={SECTION.documents}
                warning={avisoDe(pendientes, 'documents')}
                kind={kind}
                organizationId={organization.id}
                documents={organization.documents ?? []}
                editable
                legalNature={organization.legalNature}
              />
              {/* Lo legal junto: la declaracion se firma en su pantalla, pero
                  se busca aqui. */}
              {kind === 'supplier' && <DeclarationStatusPanel organization={organization} />}
            </>
          }
        />
      ) : (
        /* Sin organization:update los datos se leen, no se editan. */
        <Panel
          title='Información de la empresa'
          description='Solo el administrador de tu empresa puede modificarlos.'
        >
          <ul className='data-list'>
            {readOnlyFields.map(({ label, value }) => (
              <li key={label}>
                <span className='font-light'>{label}</span>
                <span>{value ?? '—'}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </>
  );
};

export default MyCompanyScreen;
