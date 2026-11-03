"use client";

import Link from "next/link";
import { ChevronLeft, ExternalLink } from "react-feather";

import { extractErrorMessage } from "@/shared/lib/apiError";
import { formatDate, formatDay } from "@/shared/lib/dates";
import { hasPermission } from "@/shared/lib/permissions";
import { PageSkeleton, Panel } from "@/shared/ui";
import { useAppSelector } from "@/store/hooks";

import { useGetPayoutQuery } from "../../api/financeApi";
import { usePayoutFiles } from "../../hooks/usePayoutFiles";
import { formatPercent, pesos } from "../../lib/format";
import type { Payout } from "../../model/finance.types";
import MarkPayoutPaidForm from "../staff/MarkPayoutPaidForm";

/* Una liquidacion, para finanzas y para el proveedor.

   Lo que se lee es lo mismo —que pedidos entraron, cuanto vendio, cuanto se
   quedo Suminia y cuanto se le transfirio— y lo que cambia es que finanzas la
   marca pagada con el comprobante. El proveedor cuadra contra esto lo que le
   llego al banco. */

const COPY = {
  staff: {
    volver: "Liquidaciones",
    base: "/admin/finance/payouts",
    pedidos: "/admin/orders",
  },
  supplier: {
    volver: "Mis liquidaciones",
    base: "/supplier/payouts",
    pedidos: "/supplier/orders",
  },
};

export const PayoutDetailScreen = ({
  payoutId,
  side,
}: {
  payoutId: string;
  side: "staff" | "supplier";
}) => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  const { data, isLoading, isError, error } = useGetPayoutQuery(payoutId, {
    skip: !hydrated,
  });
  const files = usePayoutFiles(payoutId);
  const copy = COPY[side];

  if (!hydrated || isLoading) return <PageSkeleton variant="detail" />;
  if (isError || !data) {
    return (
      <div className="alert alert-danger">
        {extractErrorMessage(error, "No se pudo cargar la liquidación.")}
      </div>
    );
  }

  const payout = data.data;
  const puedePagar =
    side === "staff" &&
    payout.status === "PENDING" &&
    hasPermission(permissions, "finance:manage");

  const archivo = (titulo: string, file: Payout["receipt"], vacio: string) => (
    <div
      className={`document-slot is-versioned${file ? " is-filled" : side === "staff" ? " is-missing" : ""}`}
    >
      <div className="document-slot-row">
        <div className="document-slot-text">
          <div className="document-slot-title">
            <strong>{titulo}</strong>
            <span className={`document-state is-${file ? "success" : "muted"}`}>
              {file ? "Adjunto" : "Sin adjuntar"}
            </span>
          </div>
          <small className="font-light">{file?.filename ?? vacio}</small>
        </div>
        {file && (
          <div className="document-slot-actions">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm btn-with-icon"
              disabled={files.opening === file.storageKey}
              onClick={() => files.open(file.storageKey)}
            >
              <ExternalLink size={14} /> Ver
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Link
        href={copy.base}
        className="font-light d-inline-flex align-items-center gap-1 mb-3"
      >
        <ChevronLeft size={16} />
        {copy.volver}
      </Link>

      <div className="order-head">
        <div>
          <h1>Liquidación {payout.code}</h1>
          <p className="font-light mb-0">
            {side === "staff" && `${payout.supplier.name} · `}
            Generada el {formatDate(payout.createdAt)}
            {side === "staff" && ` por ${payout.createdByName}`}
          </p>
        </div>
        <span
          className={`document-state is-${payout.status === "PAID" ? "success" : "neutral"}`}
        >
          {payout.status === "PAID" ? "Pagada" : "Por pagar"}
        </span>
      </div>

      <div className="order-layout">
        <div className="order-main">
          <Panel title="Pedidos">
            <div className="catalog-table-scroll">
              <table className="catalog-table">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Comprador</th>
                    <th>Entregado</th>
                    <th>Factura</th>
                    {side === "staff" && (
                      <>
                        <th className="num">Venta</th>
                        <th className="num">Margen</th>
                      </>
                    )}
                    <th className="num">
                      {side === "staff" ? "Al proveedor" : "Te pagamos"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payout.items.map((order) => (
                    <tr key={order.id}>
                      <td className="is-nowrap">
                        <Link href={`${copy.pedidos}/${order.id}`}>
                          {order.code}
                        </Link>
                      </td>
                      <td className="is-nowrap">{order.buyerName}</td>
                      <td className="is-nowrap">
                        {order.deliveredAt ? formatDay(order.deliveredAt) : "—"}
                      </td>
                      <td className="is-nowrap">{order.invoiceNumber ?? "—"}</td>
                      {side === "staff" && (
                        <>
                          <td className="num is-nowrap">{pesos(order.total)}</td>
                          <td className="num is-nowrap">
                            {pesos(order.commissionAmount)} ({formatPercent(order.commissionRate)})
                          </td>
                        </>
                      )}
                      <td className="num is-nowrap">
                        {pesos(order.supplierPayout)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <aside className="order-side">
          <Panel title="Liquidación">
            <ul className="cart-summary-lines order-totals">
              {side === "staff" && (
                <>
                  <li>
                    <span className="font-light">Vendido, con IVA</span>
                    <span>{pesos(payout.total)}</span>
                  </li>
                  <li>
                    <span className="font-light">Margen de Suminia, antes de IVA</span>
                    <span>{pesos(payout.commission)}</span>
                  </li>
                </>
              )}
              <li className="cart-summary-total">
                <span>
                  {side === "staff" ? "A transferir" : "Te transferimos"}
                </span>
                <strong>{pesos(payout.net)}</strong>
              </li>
            </ul>
            <ul className="data-list is-single mt-3">
              <li>
                <span className="font-light">Cuenta</span>
                <span>
                  {payout.accountNumber
                    ? `${payout.bankName ?? ""} · ${payout.accountType?.toLowerCase() ?? ""} ${payout.accountNumber}`
                    : "Sin cuenta registrada"}
                </span>
              </li>
              {payout.paidAt && (
                <li>
                  <span className="font-light">Pagada</span>
                  <span>
                    {formatDate(payout.paidAt)}
                    {payout.paidByName &&
                      side === "staff" &&
                      ` · ${payout.paidByName}`}
                  </span>
                </li>
              )}
              {payout.note && (
                <li>
                  <span className="font-light">Nota</span>
                  <span>{payout.note}</span>
                </li>
              )}
            </ul>
          </Panel>

          <Panel title="Soportes">
            <div className="document-slots">
              {archivo(
                "Comprobante de la transferencia",
                payout.receipt,
                "Se adjunta al marcarla pagada.",
              )}
            </div>
          </Panel>

          {puedePagar && <MarkPayoutPaidForm payout={payout} files={files} />}
        </aside>
      </div>
    </>
  );
};

export default PayoutDetailScreen;
