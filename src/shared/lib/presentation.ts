/* Como se nombra una presentacion junto a su empaque: "Caja x 50 · Caja".

   Muchas presentaciones se llaman igual que su empaque —"Unidad" vendida en
   "Unidad"—, y escribir los dos ("Unidad · Unidad") no dice nada: se lee como
   un error. El empaque va solo cuando añade algo. Vale para el carrito, los
   pedidos, las cotizaciones y el PDF, que lo hace igual en el backend. */
export const presentationLabel = (presentationName: string, packaging: string): string =>
  presentationName.trim().toLowerCase() === packaging.trim().toLowerCase()
    ? presentationName
    : `${presentationName} · ${packaging}`;
