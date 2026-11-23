/* Como se escriben las cifras y las condiciones de un pedido. Las usan la
   ficha del pedido y la orden de compra que ve el personal. */

export const pesos = (valor: number, moneda: string) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);

/* La condicion de pago de Suminia al proveedor, como la declaro en su perfil
   comercial. */
export const condicionDePago = (dias: number | null): string =>
  dias === null ? 'Por definir' : dias === 0 ? 'De contado' : `Crédito a ${dias} días`;
