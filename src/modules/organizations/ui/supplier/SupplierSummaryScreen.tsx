'use client';

import Link from 'next/link';
import { AlertTriangle, Check } from 'react-feather';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { PageHeader, Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetSupplierQuery } from '../../api/suppliersApi';
import { formatTaxId } from '../../lib/taxId';
import StatusBadge from '../common/StatusBadge';

/* Primera pantalla del panel: responde "¿ya puedo operar?".

   Antes repetia, en una lista suelta sobre el fondo gris, cuatro datos que
   estan enteros en Mi empresa. Un resumen que solo resume peor la pantalla de
   al lado no es un resumen.

   Ahora dice tres cosas, y en este orden: si la empresa esta aprobada, que le
   falta para poder cobrar, y los datos con los que Suminia la identifica. Lo
   que falta va antes que lo que ya esta: es lo unico accionable de la pantalla.

   Todo sale del propio modulo. Las cifras que pediria un panel de verdad
   —cuantos productos, cuantos pedidos— viven en products y en orders, y un
   modulo nunca importa otro; el dia que se quieran aqui, entran como
   componentes desde la pagina, que es la que ve a los tres. */

/* Lo que Suminia necesita para pagarle a un proveedor. Los cinco viajan juntos
   —el backend rechaza media cuenta—, de modo que o estan todos o no hay cuenta. */
const DATOS_DE_COBRO = [
  'bankName',
  'bankAccountType',
  'bankAccountNumber',
  'bankAccountHolder',
  'bankAccountHolderTaxId',
] as const;

export const SupplierSummaryScreen = () => {
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const organizationId = user?.organizationId ?? null;

  const { data, isLoading, isError, error } = useGetSupplierQuery(
    organizationId as string,
    { skip: !organizationId },
  );

  if (!hydrated || isLoading) {
    return <p className='font-light'>Cargando...</p>;
  }

  if (!organizationId) {
    return (
      <div className='alert alert-secondary'>
        Tu cuenta no está asociada a ninguna empresa.
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudo cargar el resumen.')}
      </div>
    );
  }

  const supplier = data.data;
  const isActive = supplier.status === 'ACTIVE';
  const tieneCuenta = DATOS_DE_COBRO.every((campo) => Boolean(supplier[campo]));

  const pendientes = [
    !tieneCuenta && {
      texto: 'Falta la cuenta bancaria donde Suminia te paga las ventas.',
      enlace: 'Añadir la cuenta',
    },
    !supplier.city && {
      texto: 'Falta la ciudad desde la que despachas.',
      enlace: 'Completar los datos',
    },
    !supplier.phone && {
      texto: 'Falta un teléfono de contacto para los pedidos.',
      enlace: 'Completar los datos',
    },
  ].filter((p): p is { texto: string; enlace: string } => Boolean(p));

  return (
    <>
      <PageHeader
        title='Resumen'
        description='El estado de tu empresa en Suminia y lo que falta para operar sin tropiezos.'
      />

      <Panel
        title={supplier.name}
        description={
          isActive
            ? 'Tu empresa está aprobada: puedes publicar productos y recibir pedidos.'
            : 'El equipo de Suminia está revisando tus datos. Te avisamos en cuanto quede activa.'
        }
        aside={<StatusBadge status={supplier.status} />}
      >
        {/* Lo que falta, antes que lo que ya esta: es lo unico que se puede
            hacer desde esta pantalla. Cuando no falta nada tampoco se calla
            —decirlo es la mitad de la respuesta a "¿ya puedo operar?"—. */}
        {pendientes.length > 0 ? (
          <ul className='summary-todo'>
            {pendientes.map((pendiente) => (
              <li key={pendiente.texto}>
                <AlertTriangle size={17} />
                <span>{pendiente.texto}</span>
                <Link href='/supplier/account/company'>{pendiente.enlace}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className='summary-ready'>
            <Check size={17} />
            No falta nada: tus datos de contacto y de cobro están completos.
          </p>
        )}
      </Panel>

      <Panel
        title='Datos de la empresa'
        description='Con estos datos te identifica Suminia y te ven los compradores.'
        aside={
          <Link href='/supplier/account/company' className='btn btn-outline-secondary btn-sm'>
            Editar
          </Link>
        }
      >
        <ul className='data-list'>
          <li>
            <span className='font-light'>NIT</span>
            <span>{formatTaxId(supplier.taxId)}</span>
          </li>
          <li>
            <span className='font-light'>Razón social</span>
            <span>{supplier.legalName}</span>
          </li>
          <li>
            <span className='font-light'>Correo de contacto</span>
            <span>{supplier.email}</span>
          </li>
          <li>
            <span className='font-light'>Teléfono</span>
            <span>{supplier.phone ?? '—'}</span>
          </li>
          <li>
            <span className='font-light'>Ciudad</span>
            <span>{supplier.city ?? '—'}</span>
          </li>
          <li>
            <span className='font-light'>Dirección</span>
            <span>{supplier.address ?? '—'}</span>
          </li>
        </ul>
      </Panel>
    </>
  );
};

export default SupplierSummaryScreen;
