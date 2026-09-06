/* Una empresa solo opera cuando Suminia la ha verificado.

   Vive en shared porque lo necesitan varios modulos y ninguno puede importar a
   otro. Es solo comodidad: quien decide es ActiveOrganizationGuard en el
   backend, que responde 403 con el mismo criterio.

   Un estado nulo identifica al personal interno de Suminia, que no pertenece a
   ninguna empresa y no queda limitado. */
export const canOperate = (organizationStatus: string | null | undefined): boolean =>
  organizationStatus == null || organizationStatus === 'ACTIVE';
