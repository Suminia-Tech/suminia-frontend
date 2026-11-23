import { PageSkeleton } from '@/shared/ui';

/* Solo la lista: la cabecera y las pestañas son del layout y se quedan. */
export default function Loading() {
  return <PageSkeleton variant='list' header={false} />;
}
