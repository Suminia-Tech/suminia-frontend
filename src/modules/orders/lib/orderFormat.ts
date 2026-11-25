/* Como se escriben las cifras y las condiciones de un pedido. Las usan la
   ficha del pedido y la orden de compra que ve el personal. */

export const pesos = (valor: number, moneda: string) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);

/* La condicion de pago de Suminia al proveedor, como la declaro en su perfil
   comercial. Es obligatoria para aprobarlo; un proveedor de antes de la
   regla puede no tenerla, y se dice que falta en vez de "Por definir", que
   no decia quien la tenia que definir. */
export const condicionDePago = (dias: number | null): string =>
  dias === null
    ? 'Pendiente de registrar por el proveedor'
    : dias === 0
      ? 'De contado'
      : `Crédito a ${dias} días`;
