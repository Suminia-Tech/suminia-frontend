import type {
  OrganizationDocument,
  OrganizationDocumentType,
} from '../model/organization.types';

/* Donde esta cada documento visto como un todo, no como version suelta.
   MISSING es lo que la hoja de sugerencias llama "Pendiente": nunca se subio. */
export type DocumentState = 'MISSING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface DocumentSlot {
  state: DocumentState;
  /* La ultima version que cuenta: lo que se esta revisando, lo que se aprobo
     o lo que se rechazo. Nula si nunca se subio. */
  latest: OrganizationDocument | null;
  /* La version aprobada que sigue valiendo. Puede no ser la ultima: mientras
     se revisa un cambio, o si se rechazo, la anterior sigue vigente. */
  current: OrganizationDocument | null;
  /* Todas, la mas reciente primero. */
  history: OrganizationDocument[];
}

/* Un backend anterior no manda el estado: lo que habia subido se tenia por
   entregado y se trata como en revision. */
const statusOf = (document: OrganizationDocument) => document.status ?? 'IN_REVIEW';

const byNewest = (a: OrganizationDocument, b: OrganizationDocument) =>
  b.uploadedAt.localeCompare(a.uploadedAt);

export const documentSlot = (
  documents: OrganizationDocument[] | undefined,
  type: OrganizationDocumentType,
): DocumentSlot => {
  const history = (documents ?? []).filter((d) => d.type === type).sort(byNewest);
  const latest = history.find((d) => statusOf(d) !== 'REPLACED') ?? null;
  const current =
    history.find((d) => statusOf(d) === 'APPROVED' || statusOf(d) === 'EXPIRED') ?? null;

  return {
    state: latest ? (statusOf(latest) as Exclude<DocumentState, 'MISSING'>) : 'MISSING',
    latest,
    current,
    history,
  };
};

/* Lo que cuenta como entregado para aprobar la empresa: lo que espera
   revision o se aprobo. La misma regla que isDelivered en el backend. */
export const isDelivered = (document: OrganizationDocument): boolean => {
  const status = statusOf(document);
  return status === 'IN_REVIEW' || status === 'APPROVED' || status === 'EXPIRED';
};

/* Lo que la empresa tiene que hacer algo: subirlo, corregirlo o renovarlo. */
export const needsAction = (slot: DocumentSlot): boolean =>
  slot.state === 'MISSING' || slot.state === 'REJECTED' || slot.state === 'EXPIRED';

/* Etiqueta y tono de la etiqueta de estado (document-state). */
export const DOCUMENT_STATE_META: Record<
  DocumentState,
  { label: string; tone: 'success' | 'neutral' | 'danger' | 'muted' }
> = {
  MISSING: { label: 'Pendiente', tone: 'muted' },
  IN_REVIEW: { label: 'En revisión', tone: 'neutral' },
  APPROVED: { label: 'Aprobado', tone: 'success' },
  REJECTED: { label: 'Rechazado', tone: 'danger' },
  EXPIRED: { label: 'Vencido', tone: 'danger' },
};

/* El de cada version en el historial, que tambien puede estar reemplazada. */
export const VERSION_STATUS_LABEL: Record<NonNullable<OrganizationDocument['status']>, string> = {
  IN_REVIEW: 'En revisión',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  REPLACED: 'Reemplazado',
  EXPIRED: 'Vencido',
};

export const versionStatusLabel = (document: OrganizationDocument): string =>
  VERSION_STATUS_LABEL[statusOf(document)];
