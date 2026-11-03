"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Upload } from "react-feather";
import { toast } from "react-toastify";

import { extractErrorMessage } from "@/shared/lib/apiError";
import { Panel } from "@/shared/ui";

import { useMarkPayoutPaidMutation } from "../../api/financeApi";
import { FILE_ACCEPT, type usePayoutFiles } from "../../hooks/usePayoutFiles";
import { pesos } from "../../lib/format";
import type { Payout } from "../../model/finance.types";

export type PayoutFiles = ReturnType<typeof usePayoutFiles>;

/* Marcarla pagada con el comprobante de la transferencia: es lo que el
   proveedor va a cuadrar. No hay factura de comision: el proveedor le
   factura a Suminia el neto, y el 10% es el margen de Suminia. */
export const MarkPayoutPaidForm = ({
  payout,
  files,
}: {
  payout: Payout;
  files: PayoutFiles;
}) => {
  const [markPaid, { isLoading }] = useMarkPayoutPaidMutation();
  const recibo = useRef<HTMLInputElement>(null);

  const [receipt, setReceipt] = useState<File | null>(null);

  const [note, setNote] = useState("");

  const pagar = async () => {
    if (!receipt) return;
    try {
      const r = await files.upload("receipt", receipt);

      await markPaid({
        id: payout.id,
        receiptStorageKey: r.storageKey,
        receiptFilename: r.filename,

        ...(note.trim() ? { note: note.trim() } : {}),
      }).unwrap();
      toast.success("Liquidación pagada. Le avisamos al proveedor");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : extractErrorMessage(err, "No se pudo guardar."),
      );
    }
  };

  const elegir = (
    ref: React.RefObject<HTMLInputElement | null>,
    file: File | null,
    label: string,
  ) => (
    <button
      type="button"
      className="btn btn-outline-secondary btn-sm btn-with-icon"
      onClick={() => ref.current?.click()}
    >
      <Upload size={14} /> {file ? file.name : label}
    </button>
  );

  const onFile =
    (setter: (file: File | null) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.files?.[0] ?? null);
      event.target.value = "";
    };

  return (
    <Panel
      title="Marcar como pagada"
      description={`Transfiere ${pesos(payout.net)} a la cuenta del proveedor y adjunta el comprobante.`}
    >
      <div className="order-payment-actions">
        {elegir(recibo, receipt, "Elegir comprobante")}
      </div>
      <label className="form-label mt-3" htmlFor="liquidacion-nota">
        Nota (opcional)
      </label>
      <input
        id="liquidacion-nota"
        type="text"
        maxLength={500}
        className="form-control"
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
      <button
        type="button"
        className="btn btn-primary btn-full mt-3"
        disabled={!receipt || isLoading || files.uploading}
        onClick={pagar}
      >
        {isLoading || files.uploading ? "Guardando..." : "Marcar como pagada"}
      </button>
      <input
        ref={recibo}
        type="file"
        accept={FILE_ACCEPT}
        className="d-none"
        onChange={onFile(setReceipt)}
      />
    </Panel>
  );
};

export default MarkPayoutPaidForm;
