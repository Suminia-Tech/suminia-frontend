'use client';

import { Col, Row } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { useAppSelector } from '@/store/hooks';

import { useGetSupplierQuery } from '../../api/suppliersApi';
import { formatTaxId } from '../../lib/taxId';
import StatusBadge from '../common/StatusBadge';

/* Primera pantalla del panel: responde "¿ya puedo operar?".

   Reemplaza el dashboard de la demo, que mostraba pedidos y wishlist inventados
   que no significan nada para un proveedor. */
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

  return (
    <>
      <div className='box-head'>
        <h3>Resumen</h3>
      </div>

      <Row className='mb-4'>
        <Col md='12'>
          <h4 className='mb-2'>{supplier.name}</h4>
          <StatusBadge status={supplier.status} />
        </Col>
      </Row>

      {isActive ? (
        <div className='alert alert-success'>
          Tu empresa está aprobada y puede operar en Suminia.
        </div>
      ) : (
        <div className='alert alert-warning'>
          Tu empresa está pendiente de aprobación. El equipo de Suminia revisa los datos
          y te avisa cuando quede activa.
        </div>
      )}

      <ul className='dash-profile'>
        <li>
          <div className='left'>
            <h6 className='font-light'>NIT</h6>
          </div>
          <div className='right'>
            <h6>{formatTaxId(supplier.taxId)}</h6>
          </div>
        </li>
        <li>
          <div className='left'>
            <h6 className='font-light'>Razón social</h6>
          </div>
          <div className='right'>
            <h6>{supplier.legalName}</h6>
          </div>
        </li>
        <li>
          <div className='left'>
            <h6 className='font-light'>Correo de contacto</h6>
          </div>
          <div className='right'>
            <h6>{supplier.email}</h6>
          </div>
        </li>
        <li>
          <div className='left'>
            <h6 className='font-light'>Ciudad</h6>
          </div>
          <div className='right'>
            <h6>{supplier.city ?? '—'}</h6>
          </div>
        </li>
      </ul>
    </>
  );
};

export default SupplierSummaryScreen;
