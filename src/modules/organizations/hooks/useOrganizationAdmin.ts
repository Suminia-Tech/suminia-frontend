'use client';

import type { DatatableParams } from '@/shared/api/types';

import {
  useApproveBuyerMutation,
  useGetBuyerQuery,
  useGetBuyersQuery,
  useReactivateBuyerMutation,
  useRejectBuyerMutation,
  useSuspendBuyerMutation,
} from '../api/buyersApi';
import {
  useApproveSupplierMutation,
  useGetSupplierQuery,
  useGetSuppliersQuery,
  useReactivateSupplierMutation,
  useRejectSupplierMutation,
  useSuspendSupplierMutation,
} from '../api/suppliersApi';

/* Proveedores y compradores se administran igual: el mismo listado, los mismos
   filtros y las mismas cuatro decisiones sobre si la empresa puede operar. Lo
   unico que cambia es a que endpoint van y como se llaman en pantalla.

   El backend los separa a proposito —dos dominios, dos rutas— y aqui se
   reunen, que es lo que el modulo `organizations` viene haciendo desde el
   principio con sus tablas y formularios compartidos.

   Se llaman los dos juegos de hooks y se descarta el que no toca: las reglas de
   React no dejan llamarlos dentro de un condicional. Las consultas que sobran
   se saltan con `skip`, de modo que solo se pide lo que se va a usar; las
   mutaciones no lanzan nada hasta que se invocan. */
export type OrganizationKind = 'supplier' | 'buyer';

export const useOrganizationList = (
  kind: OrganizationKind,
  params: DatatableParams,
  options?: { skip?: boolean },
) => {
  const esProveedor = kind === 'supplier';
  const skip = options?.skip ?? false;

  const proveedores = useGetSuppliersQuery(params, { skip: skip || !esProveedor });
  const compradores = useGetBuyersQuery(params, { skip: skip || esProveedor });

  return esProveedor ? proveedores : compradores;
};

export const useOrganizationDetail = (
  kind: OrganizationKind,
  id: string,
  options?: { skip?: boolean },
) => {
  const esProveedor = kind === 'supplier';
  const skip = options?.skip ?? false;

  const proveedor = useGetSupplierQuery(id, { skip: skip || !esProveedor });
  const comprador = useGetBuyerQuery(id, { skip: skip || esProveedor });

  return esProveedor ? proveedor : comprador;
};

/* Las cuatro decisiones del personal interno. Se devuelven juntas porque la
   pantalla las ofrece juntas, segun el estado en que este la empresa. */
export const useOrganizationDecisions = (kind: OrganizationKind) => {
  const esProveedor = kind === 'supplier';

  const [approveSupplier, approveSupplierState] = useApproveSupplierMutation();
  const [rejectSupplier, rejectSupplierState] = useRejectSupplierMutation();
  const [suspendSupplier, suspendSupplierState] = useSuspendSupplierMutation();
  const [reactivateSupplier, reactivateSupplierState] =
    useReactivateSupplierMutation();

  const [approveBuyer, approveBuyerState] = useApproveBuyerMutation();
  const [rejectBuyer, rejectBuyerState] = useRejectBuyerMutation();
  const [suspendBuyer, suspendBuyerState] = useSuspendBuyerMutation();
  const [reactivateBuyer, reactivateBuyerState] = useReactivateBuyerMutation();

  const approve = esProveedor ? approveSupplier : approveBuyer;
  const reject = esProveedor ? rejectSupplier : rejectBuyer;
  const suspend = esProveedor ? suspendSupplier : suspendBuyer;
  const reactivate = esProveedor ? reactivateSupplier : reactivateBuyer;

  const isBusy = [
    approveSupplierState,
    rejectSupplierState,
    suspendSupplierState,
    reactivateSupplierState,
    approveBuyerState,
    rejectBuyerState,
    suspendBuyerState,
    reactivateBuyerState,
  ].some((state) => state.isLoading);

  return { approve, reject, suspend, reactivate, isBusy };
};

/* Como se llama cada lado en pantalla. Vive junto a los hooks para que añadir
   un tercer tipo de organizacion sea tocar un sitio. */
export const KIND_COPY: Record<
  OrganizationKind,
  {
    plural: string;
    singular: string;
    descripcion: string;
    basePath: string;
    vacio: string;
    sinCoincidencias: string;
  }
> = {
  supplier: {
    plural: 'Proveedores',
    singular: 'proveedor',
    descripcion: 'Laboratorios, fabricantes e importadores registrados en Suminia.',
    basePath: '/admin/suppliers',
    vacio: 'Todavía no hay proveedores registrados.',
    sinCoincidencias: 'Ningún proveedor coincide con la búsqueda.',
  },
  buyer: {
    plural: 'Compradores',
    singular: 'comprador',
    descripcion: 'Clínicas, hospitales y distribuidores registrados en Suminia.',
    basePath: '/admin/buyers',
    vacio: 'Todavía no hay compradores registrados.',
    sinCoincidencias: 'Ningún comprador coincide con la búsqueda.',
  },
};
