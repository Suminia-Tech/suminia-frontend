'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { AlertTriangle, ChevronLeft, FileText } from 'react-feather';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate, formatDateTime } from '@/shared/lib/dates';
import { PageHeader, PageSkeleton, Panel } from '@/shared/ui';
import { hasPermission } from '@/shared/lib/permissions';
import { useAppSelector } from '@/store/hooks';

import {
  KIND_COPY,
  useOrganizationDecisions,
  useOrganizationDetail,
  useOrganizationStatusHistory,
  type OrganizationKind,
} from '../../hooks/useOrganizationAdmin';
import {
  BUYER_CONTACT_AREA_OPTIONS,
  CONTACT_AREA_OPTIONS,
  contactAreaLabel,
  describeBuyerProfile,
  describeActivityLines,
  describeExporter,
} from '../../lib/commercialProfile';
import { formatDeliveryTime } from '../../lib/deliveryTime';
import { formatTaxId, wrongCheckDigit } from '../../lib/taxId';
import { getStatusLabel } from '../../lib/organizationStatus';
import {
  MIN_REASON_LENGTH,
  type OrganizationStatus,
} from '../../model/organization.types';
import BuyerLocationsPanel from './BuyerLocationsPanel';
import ContactPeopleList from './ContactPeopleList';
import DeclarationSummaryPanel from './DeclarationSummaryPanel';
import WarehouseCcaaSlot from './WarehouseCcaaSlot';
import LegalDocumentsPanel from './LegalDocumentsPanel';
import StatusBadge from './StatusBadge';


const dinero = (valor: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);

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
  /* Rechazar y suspender piden el motivo antes de ejecutarse, en el mismo
     panel de la decision: le llega a la empresa en el correo y queda en el
     historial. */
  const [conMotivo, setConMotivo] = useState<'reject' | 'suspend' | null>(null);
  const [motivo, setMotivo] = useState('');
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
  const historial = useOrganizationStatusHistory(kind, organizationId, {
    skip: !hydrated || !canDecide,
  });

  if (!hydrated || isLoading) {
    return <PageSkeleton variant='detail' />;
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
      setConMotivo(null);
      setMotivo('');
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

  /* Lo que la empresa dejo en blanco. El registro ya pide telefono, direccion
     y ciudad, de modo que esto solo pasa con las empresas que se registraron
     antes; quien decide si la empresa puede operar merece verlo dicho, no
     deducirlo de una raya. */
  const sinLlenar = datos
    .filter((campo) => !campo.value)
    .map((campo) => campo.label.toLowerCase());

  const esProveedor = kind === 'supplier';
  const digitoCorrecto = wrongCheckDigit(organization.taxId);
  /* Las areas del proveedor sin una persona con nombre, correo y celular: el
     backend no deja aprobarlo sin ellas. */
  const areasSinContacto = esProveedor
    ? CONTACT_AREA_OPTIONS.filter(
        ({ value }) =>
          !organization.contacts?.some(
            (c) => c.area === value && c.name && c.email && c.phone,
          ),
      ).map(({ label }) => label)
    : [];
  const tieneCuenta = Boolean(
    organization.bankName && organization.bankAccountNumber,
  );

  const perfil = [
    /* Que vende en cada actividad: "Fabricante: Mobiliario hospitalario". */
    {
      label: 'Actividades y líneas',
      value: describeActivityLines(organization).join(' · ') || null,
    },
    { label: 'Exporta', value: describeExporter(organization.exporter) },
  ];
  const tienePerfil = perfil.some((campo) => campo.value !== null);

  const decidiendo = organization.status === 'PENDING';

  const botones = [
    available.includes('approve') && {
      texto: 'Aprobar',
      clase: 'btn btn-primary',
      accion: () =>
        run(
          () => approve({ id: organization.id }).unwrap(),
          `${nombre} aprobado`,
          'No se pudo aprobar.',
        ),
    },
    available.includes('reject') && {
      texto: 'Rechazar',
      clase: 'btn btn-outline-danger',
      accion: async () => {
        setConMotivo('reject');
      },
    },
    available.includes('suspend') && {
      texto: 'Suspender',
      clase: 'btn btn-outline-danger',
      accion: async () => {
        setConMotivo('suspend');
      },
    },
    available.includes('reactivate') && {
      texto: 'Reactivar',
      clase: 'btn btn-primary',
      accion: () =>
        run(
          () => reactivate({ id: organization.id }).unwrap(),
          `${nombre} reactivado`,
          'No se pudo reactivar.',
        ),
    },
  ].filter(
    (b): b is { texto: string; clase: string; accion: () => Promise<void> } =>
      Boolean(b),
  );

  /* Lo que de verdad le pasa a la empresa al suspenderla, con las mismas
     reglas que aplica el backend: sus productos salen del catalogo (solo se
     muestran los de empresas activas) y cada accion de operar pasa por la
     guarda de empresa activa. Puede entrar y mirar, pero no operar. */
  const efectosSuspension = esProveedor
    ? [
        'Sus productos dejan de aparecer para los compradores.',
        'No puede crear ni editar productos, ni responder cotizaciones.',
        'No puede confirmar, despachar ni gestionar pedidos: los que tenga en curso quedan en espera.',
        'Puede seguir entrando a su cuenta, pero sin operar.',
      ]
    : [
        'Deja de ver precios y no puede usar el carrito ni hacer pedidos.',
        'No puede pedir cotizaciones ni gestionar los pedidos que tenga en curso.',
        'Puede seguir entrando y viendo los productos, sin precios.',
      ];

  const motivoValido = motivo.trim().length >= MIN_REASON_LENGTH;
  const confirmarConMotivo = () =>
    conMotivo === 'reject'
      ? run(
          () => reject({ id: organization.id, reason: motivo }).unwrap(),
          `${nombre} rechazado. Le avisamos por correo.`,
          'No se pudo rechazar.',
        )
      : run(
          () => suspend({ id: organization.id, reason: motivo }).unwrap(),
          `${nombre} suspendido. Le avisamos por correo.`,
          'No se pudo suspender.',
        );

  return (
    <>
      <Link
        href={copy.basePath}
        className='back-link'
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
          <Panel title='Información de la empresa'>
            {/* El aviso solo mientras se decide: despues de aprobada, que el
                telefono este vacio ya no cambia nada. */}
            {decidiendo && sinLlenar.length > 0 && (
              <p className='review-missing'>
                <AlertTriangle size={16} />
                Dejó sin llenar {sinLlenar.join(', ')}: se registró antes de que
                fueran obligatorios. Pídeselos antes de aprobar.
              </p>
            )}

            {digitoCorrecto !== null && (
              <p className='review-missing'>
                <AlertTriangle size={16} />
                El dígito de verificación registrado no corresponde al NIT: según la fórmula de la
                DIAN debería ser {digitoCorrecto}. Compáralo con el RUT.
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

          {/* Del comprador: quien es y con que cuenta paga. Se muestra siempre,
              tambien vacio, porque sin ello no se puede aprobar y el revisor
              tiene que verlo dicho. */}
          {!esProveedor && (
            <Panel
              title='Perfil del comprador'
              description='Lo que declara de sí mismo y la cuenta con la que paga.'
            >
              <ul className='data-list'>
                <li>
                  <span className='font-light'>Naturaleza y actividad</span>
                  <span>{describeBuyerProfile(organization) ?? '—'}</span>
                </li>
                <li>
                  <span className='font-light'>Medio de pago</span>
                  <span>
                    {organization.bankName && organization.bankAccountNumber
                      ? `${organization.bankName} · ${organization.bankAccountNumber}`
                      : '—'}
                  </span>
                </li>
              </ul>
            </Panel>
          )}

          {!esProveedor && <BuyerLocationsPanel organizationId={organizationId} />}

          {/* La declaracion va justo despues de lo registrado: es lo otro que
              hay que leer para decidir, y sin ella el backend no deja aprobar.
              Si falta se dice, para no pulsar "Aprobar" y llevarse el error. */}
          {(esProveedor || decidiendo || organization.declaration) &&
            (organization.declaration ? (
              <DeclarationSummaryPanel
                declaration={organization.declaration}
                title='Declaración de autocontrol (SAGRILAFT)'
                showCommercialCommitments={esProveedor}
              />
            ) : (
              <Panel title='Declaración de autocontrol (SAGRILAFT)'>
                <p className='review-missing mb-0'>
                  <AlertTriangle size={16} />
                  {decidiendo
                    ? `El ${esProveedor ? 'proveedor' : 'comprador'} todavía no la envía. No se puede aprobar hasta que lo haga.`
                    : 'Se aprobó antes de que Suminia pidiera esta declaración.'}
                </p>
              </Panel>
            ))}

          {/* Para logistica y visitas de calidad. Solo si hay alguna: no es
              obligatorio, y un panel vacio no dice nada. */}
          {esProveedor && Boolean(organization.warehouses?.length) && (
            <Panel
              title='Bodegas y puntos de inventario'
              description='Dónde guarda y desde dónde despacha la mercancía.'
            >
              <ul className='data-list'>
                {organization.warehouses?.map((warehouse, index) => (
                  <li key={warehouse.id}>
                    <span className='font-light'>{warehouse.name ?? `Bodega ${index + 1}`}</span>
                    <span>
                      {warehouse.address} · {warehouse.city}
                    </span>
                  </li>
                ))}
              </ul>
              {/* El CCAA de cada bodega, para abrirlo y revisarlo como los
                  demas documentos. */}
              <div className='document-slots mt-3'>
                {organization.warehouses?.map((warehouse, index) => (
                  <WarehouseCcaaSlot
                    key={warehouse.id}
                    organizationId={organization.id}
                    warehouseId={warehouse.id}
                    documents={organization.documents ?? []}
                    editable={false}
                    reviewable={canDecide}
                    label={`CCAA · ${warehouse.name ?? `Bodega ${index + 1}`}`}
                  />
                ))}
              </div>
            </Panel>
          )}

          {/* La otra condicion sin la cual el backend no deja aprobar. */}
          {esProveedor && (
            <Panel title='Facturación electrónica'>
              {organization.issuesElectronicInvoices === true ? (
                <p className='mb-0'>Expide factura electrónica de venta validada por la DIAN.</p>
              ) : (
                <p className='review-missing mb-0'>
                  <AlertTriangle size={16} />
                  {organization.issuesElectronicInvoices === false
                    ? 'Respondió que no expide factura electrónica. No se puede aprobar.'
                    : decidiendo
                      ? 'El proveedor todavía no responde si expide factura electrónica. No se puede aprobar hasta que responda que sí.'
                      : 'Se aprobó antes de que Suminia lo preguntara.'}
                </p>
              )}
            </Panel>
          )}

          {/* Del proveedor, y solo si las registro: son datos que se llenan
              despues de aprobado, de modo que en una solicitud nueva estaran
              vacios y un panel en blanco no dice nada. */}
          {esProveedor &&
            (organization.minOrderValue !== null ||
              organization.deliveryDaysMin != null ||
              Boolean(organization.deliveryTimes?.length) ||
              organization.shippingCost != null ||
              organization.freeShippingFrom != null ||
              tieneCuenta ||
              organization.offersEarlyPaymentDiscount != null) && (
            <Panel
              title='Condiciones comerciales'
              description='Las registra el proveedor desde su panel, después de quedar aprobado.'
            >
              <ul className='data-list'>
                <li>
                  <span className='font-light'>Monto mínimo</span>
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
                <li>
                  <span className='font-light'>Tiempo de entrega</span>
                  <span>
                    {formatDeliveryTime(organization.deliveryDaysMin, organization.deliveryDaysMax) ??
                      '—'}
                  </span>
                </li>
                {organization.deliveryTimes?.map((time) => (
                  <li key={time.city}>
                    <span className='font-light'>Entrega en {time.city}</span>
                    <span>{formatDeliveryTime(time.daysMin, time.daysMax)}</span>
                  </li>
                ))}
                <li>
                  <span className='font-light'>Envío gratis desde</span>
                  <span>
                    {organization.freeShippingFrom != null
                      ? `${dinero(organization.freeShippingFrom)} + IVA`
                      : 'No ofrece'}
                  </span>
                </li>
                <li>
                  <span className='font-light'>Costo de envío</span>
                  <span>
                    {organization.shippingCost ? dinero(organization.shippingCost) : 'No cobra envío'}
                  </span>
                </li>
                {organization.shippingCosts?.map((row) => (
                  <li key={`envio-${row.city}`}>
                    <span className='font-light'>Envío a {row.city}</span>
                    <span>{dinero(row.cost)}</span>
                  </li>
                ))}
                <li>
                  <span className='font-light'>Condición de pago</span>
                  <span>
                    {organization.paymentTermDays == null
                      ? 'Sin registrar'
                      : organization.paymentTermDays === 0
                        ? 'De contado'
                        : `Crédito a ${organization.paymentTermDays} días`}
                  </span>
                </li>
                <li>
                  <span className='font-light'>Pronto pago</span>
                  <span>
                    {organization.offersEarlyPaymentDiscount
                      ? `${organization.earlyPaymentDiscountRate}% si paga en ${organization.earlyPaymentDiscountDays} días`
                      : organization.offersEarlyPaymentDiscount === false
                        ? 'No ofrece'
                        : '—'}
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
                    <li>
                      <span className='font-light'>Llave Bre-B</span>
                      <span>{organization.breBKey ?? '—'}</span>
                    </li>
                  </>
                )}
              </ul>
            </Panel>
          )}

          {/* Con quien hablar en la empresa. Tambien lo llena despues de
              aprobada, y por eso solo aparece si hay algo. */}
          {(Boolean(organization.contacts?.length) ||
            Boolean(organization.orderEmails?.length) ||
            (decidiendo && areasSinContacto.length > 0)) && (
              <Panel
                title='Contactos'
                description={
                  esProveedor
                    ? 'Las personas de cada área y a dónde llegan las órdenes de compra.'
                    : 'Las personas de cada área de la organización.'
                }
                warning={
                  areasSinContacto.length > 0
                    ? `Falta el contacto de ${areasSinContacto.join(', ')}, con nombre, correo y celular.${decidiendo ? ' No se puede aprobar hasta que el proveedor los registre.' : ''}`
                    : undefined
                }
              >
                <ContactPeopleList
                  contacts={organization.contacts ?? []}
                  areas={esProveedor ? CONTACT_AREA_OPTIONS : BUYER_CONTACT_AREA_OPTIONS}
                />
                {esProveedor && (
                  <ul className='data-list is-single contact-order-emails'>
                    <li>
                      <span className='font-light'>Órdenes de compra</span>
                      <span>
                        {organization.orderEmails?.length
                          ? organization.orderEmails.join(', ')
                          : '—'}
                      </span>
                    </li>
                  </ul>
                )}
              </Panel>
            )}

          {/* Igual que las condiciones: lo llena despues, y solo se muestra si
              hay algo. */}
          {esProveedor && tienePerfil && (
            <Panel
              title='Perfil comercial'
              description='Qué hace en la cadena y qué vende, según el proveedor.'
            >
              <ul className='data-list'>
                {perfil.map(({ label, value }) => (
                  <li key={label}>
                    <span className='font-light'>{label}</span>
                    <span>{value ?? '—'}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>

        <aside className='order-side'>
          {canDecide && botones.length > 0 && (
            <Panel className='order-next'>
              {conMotivo ? (
                <div className='status-reason'>
                  {conMotivo === 'suspend' && (
                    <div className='status-effects'>
                      <p>Al suspender a este {copy.singular}, hasta que lo reactives:</p>
                      <ul>
                        {efectosSuspension.map((efecto) => (
                          <li key={efecto}>{efecto}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <label className='form-label' htmlFor='motivo-decision'>
                    {conMotivo === 'reject' ? 'Motivo del rechazo' : 'Motivo de la suspensión'}
                  </label>
                  <textarea
                    id='motivo-decision'
                    className='form-control'
                    rows={4}
                    maxLength={1000}
                    autoFocus
                    placeholder={
                      conMotivo === 'reject'
                        ? 'El RUT no coincide con la razón social registrada.'
                        : 'Tres pedidos sin despachar en el último mes.'
                    }
                    value={motivo}
                    onChange={(event) => setMotivo(event.target.value)}
                  />
                  <p className='font-light status-reason-note'>
                    Le llega a la empresa en el correo que le avisa la decisión, para que sepa qué
                    corregir. También queda en el historial, con tu nombre y la fecha.
                  </p>
                  <div className='order-actions'>
                    <button
                      type='button'
                      className='btn btn-danger'
                      disabled={isBusy || !motivoValido}
                      onClick={confirmarConMotivo}
                    >
                      {isBusy
                        ? 'Guardando...'
                        : conMotivo === 'reject'
                          ? `Rechazar ${copy.singular}`
                          : `Suspender ${copy.singular}`}
                    </button>
                    <button
                      type='button'
                      className='btn btn-outline-secondary'
                      disabled={isBusy}
                      onClick={() => {
                        setConMotivo(null);
                        setMotivo('');
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
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
                  {available.includes('suspend') && (
                    <p className='font-light status-reason-note mb-0'>
                      Suspender saca al {copy.singular} de la operación hasta que lo reactives:{' '}
                      {esProveedor
                        ? 'sus productos dejan de mostrarse y no puede gestionar pedidos.'
                        : 'deja de ver precios y no puede comprar.'}{' '}
                      Se le avisa por correo con el motivo.
                    </p>
                  )}
                </div>
              )}
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

          {/* La constancia de cada decision sobre la empresa: solo la ve quien
              puede decidir. A la empresa le llego el motivo por correo. */}
          {canDecide && Boolean(historial.data?.data.length) && (
            <Panel
              title='Historial de decisiones'
              description='Quién decidió, cuándo y por qué. Solo lo ve el equipo de Suminia.'
            >
              <ul className='status-history'>
                {historial.data?.data.map((cambio) => (
                  <li key={cambio.id}>
                    <div className='status-history-head'>
                      <StatusBadge status={cambio.toStatus} />
                      <span className='font-light'>{formatDateTime(cambio.createdAt)}</span>
                    </div>
                    <p className='status-history-who'>
                      {getStatusLabel(cambio.fromStatus)} → {getStatusLabel(cambio.toStatus)} · por{' '}
                      {cambio.userName}
                    </p>
                    {cambio.reason && <p className='status-history-reason'>{cambio.reason}</p>}
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {/* Los soportes que sube la empresa desde su panel. Se listan
              todos, cargados o no: un revisor que no ve el RUT tiene que saber
              que falta, no buscarlo. */}
          <LegalDocumentsPanel
            kind={kind}
            organizationId={organization.id}
            documents={organization.documents ?? []}
            editable={false}
            reviewable={canDecide}
            legalNature={organization.legalNature}
          />
          {kind === 'supplier' && (
            <LegalDocumentsPanel
              group='sanitary'
              kind={kind}
              organizationId={organization.id}
              documents={organization.documents ?? []}
              editable={false}
              reviewable={canDecide}
            />
          )}
        </aside>
      </div>
    </>
  );
};

export default OrganizationDetailScreen;
