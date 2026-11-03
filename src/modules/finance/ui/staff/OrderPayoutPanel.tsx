'use client';

import Link from 'next/link';
import { ExternalLink } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate, formatDateTime } from '@/shared/lib/dates';
import { hasPermission } from '@/shared/lib/permissions';
import { Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import {
  useCreatePayoutMutation,
  useGetPayableQuery,
  useGetPayoutQuery,
} from '../../api/financeApi';
import { usePayoutFiles } from '../../hooks/usePayoutFiles';
import { pesos } from '../../lib/format';
import MarkPayoutPaidForm from './MarkPayoutPaidForm';

/* El ultimo tramo del pedido para Suminia, dentro del propio pedido: generar
   la liquidacion al proveedor y marcarla pagada con el comprobante. Son los
   mismos pasos de Finanzas > Liquidaciones, para no tener que salir de aqui.

   La liquidacion es por proveedor, no por pedido: si el proveedor tiene otros
   pedidos listos, entran todos en la misma, y el panel lo dice antes de
   generarla. Sin el permiso de finanzas se ve el estado, sin los botones. */

interface OrderPayoutPanelProps {
  orderId: string;
  supplierOrganizationId: string;
  payout: { id: string; code: string; status: 'PENDING' | 'PAID' } | null;
}

export const OrderPayoutPanel = ({
  orderId,
  supplierOrganizationId,
  payout,
}: OrderPayoutPanelProps) => {
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  const puedeLiquidar = hasPermission(permissions, 'finance:manage');

  if (payout) return <GeneratedPayout payoutId={payout.id} canPay={puedeLiquidar} />;
  if (!puedeLiquidar) return null;
  return <PendingPayout orderId={orderId} supplierOrganizationId={supplierOrganizationId} />;
};

/* Todavia sin liquidacion: lista para generarse, o en dias de reclamo. */
const PendingPayout = ({
  orderId,
  supplierOrganizationId,
}: {
  orderId: string;
  supplierOrganizationId: string;
}) => {
  const { data, isLoading } = useGetPayableQuery();
  const [create, creando] = useCreatePayoutMutation();
  const proveedor = data?.data.find((p) => p.supplier.id === supplierOrganizationId);
  const listo = proveedor?.ready.find((o) => o.id === orderId);
  const enReclamo = proveedor?.upcoming.find((o) => o.id === orderId);
  const sinFactura = proveedor?.blocked.find((o) => o.id === orderId);

  if (isLoading || (!listo && !enReclamo && !sinFactura) || !proveedor) return null;

  if (sinFactura) {
    return (
      <Panel
        title='Liquidación al proveedor'
        aside={<span className='document-state is-danger'>Sin factura</span>}
      >
        <p className='font-light mb-0'>
          No se le puede pagar al proveedor hasta que adjunte su factura electrónica a Suminia
          por {pesos(sinFactura.supplierPayout)}. Entra en la liquidación en cuanto la adjunte.
        </p>
      </Panel>
    );
  }

  if (!listo) {
    return (
      <Panel title='Liquidación al proveedor'>
        <p className='font-light mb-0'>
          Entra en la liquidación cuando el comprador lo cierre o cuando terminen los días de
          reclamo{enReclamo?.payableAt ? `, el ${formatDateTime(enReclamo.payableAt)}` : ''}.
        </p>
      </Panel>
    );
  }

  const otros = proveedor.ready.length - 1;
  const generar = async () => {
    try {
      const nueva = (await create(supplierOrganizationId).unwrap()).data;
      toast.success(`Liquidación ${nueva.code} generada`);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo generar la liquidación.'));
    }
  };

  return (
    <Panel
      title='Liquidación al proveedor'
      aside={<span className='document-state is-neutral'>Por generar</span>}
    >
      <ul className='data-list is-single'>
        <li>
          <span className='font-light'>Este pedido</span>
          <span>{pesos(listo.supplierPayout)}</span>
        </li>
        {otros > 0 && (
          <li>
            <span className='font-light'>Con sus otros {otros} listos</span>
            <span>{pesos(proveedor.readyNet)}</span>
          </li>
        )}
        <li>
          <span className='font-light'>Cuenta</span>
          <span>
            {proveedor.supplier.accountNumber
              ? `${proveedor.supplier.bankName ?? ''} · ${proveedor.supplier.accountType?.toLowerCase() ?? ''} ${proveedor.supplier.accountNumber}`
              : 'Sin cuenta registrada'}
          </span>
        </li>
      </ul>
      <small className='font-light d-block mt-3'>
        {otros > 0
          ? `La liquidación es por proveedor: incluye este pedido y los otros ${otros} de ${proveedor.supplier.name} que ya están listos.`
          : `Se genera la liquidación de ${proveedor.supplier.name} con este pedido.`}
      </small>
      <button
        type='button'
        className='btn btn-primary btn-full mt-3'
        disabled={creando.isLoading}
        onClick={generar}
      >
        {creando.isLoading ? 'Generando...' : 'Generar liquidación'}
      </button>
    </Panel>
  );
};

/* Ya generada: por pagar, con el formulario del comprobante, o pagada. */
const GeneratedPayout = ({ payoutId, canPay }: { payoutId: string; canPay: boolean }) => {
  const { data } = useGetPayoutQuery(payoutId);
  const files = usePayoutFiles(payoutId);
  const payout = data?.data;
  if (!payout) return null;

  const pagada = payout.status === 'PAID';

  return (
    <>
      <Panel
        title='Liquidación al proveedor'
        aside={
          <span className={`document-state is-${pagada ? 'success' : 'neutral'}`}>
            {pagada ? 'Pagada' : 'Por pagar'}
          </span>
        }
      >
        <ul className='data-list is-single'>
          <li>
            <span className='font-light'>Liquidación</span>
            <span>
              <Link href={`/admin/finance/payouts/${payout.id}`}>{payout.code}</Link>
              {payout.orders > 1 && ` · ${payout.orders} pedidos`}
            </span>
          </li>
          <li>
            <span className='font-light'>{pagada ? 'Transferido' : 'A transferir'}</span>
            <span>{pesos(payout.net)}</span>
          </li>
          <li>
            <span className='font-light'>Generada</span>
            <span>{formatDate(payout.createdAt)}</span>
          </li>
          {payout.paidAt && (
            <li>
              <span className='font-light'>Pagada</span>
              <span>
                {formatDate(payout.paidAt)}
                {payout.paidByName && ` · ${payout.paidByName}`}
              </span>
            </li>
          )}
        </ul>
        {payout.receipt && (
          <div className='document-slots mt-3'>
            <div className='document-slot is-versioned is-filled'>
              <div className='document-slot-row'>
                <div className='document-slot-text'>
                  <div className='document-slot-title'>
                    <strong>Comprobante de la transferencia</strong>
                    <span className='document-state is-success'>Adjunto</span>
                  </div>
                  <small className='font-light'>{payout.receipt.filename}</small>
                </div>
                <div className='document-slot-actions'>
                  <button
                    type='button'
                    className='btn btn-outline-secondary btn-sm btn-with-icon'
                    disabled={files.opening === payout.receipt.storageKey}
                    onClick={() => payout.receipt && files.open(payout.receipt.storageKey)}
                  >
                    <ExternalLink size={14} /> Ver
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Panel>

      {!pagada && canPay && <MarkPayoutPaidForm payout={payout} files={files} />}
    </>
  );
};

export default OrderPayoutPanel;
