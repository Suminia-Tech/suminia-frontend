/* La foto de un producto lista para el catalogo: un cuadro blanco de
   1200 × 1200 px con el producto centrado y el mismo margen alrededor.

   Asi lo hacen los marketplaces grandes, y es lo que da simetria a una grilla
   de productos: cada proveedor sube fotos de un tamaño, una proporcion y un
   encuadre distintos, y sin esto una camilla sale enorme y una caja de
   guantes perdida en una esquina. Se hace en el navegador, antes de subir: no
   hace falta procesar imagenes en el servidor, y lo que llega a S3 ya es la
   version final.

   1. Se busca el producto: el recuadro de lo que no es fondo blanco ni
      transparente. Si la foto no tiene fondo claro, el recuadro es la foto
      entera y simplemente se encuadra completa.
   2. Se recorta a ese recuadro y se escala para ocupar el cuadro menos el
      margen, sin deformar.
   3. Se pinta sobre blanco —lo transparente de un PNG queda blanco— y se
      exporta en JPG.

   Lo que no se puede hacer aqui es quitar un fondo que no es blanco: por eso
   el aviso de la subida pide fondo blanco liso. */

const LADO = 1200;
const MARGEN = 0.06;
/* Mas alla de esto, agrandar una foto pequeña la deja borrosa. */
const MAX_ESCALA = 3;
/* Un pixel es fondo si es casi blanco o casi transparente. */
const ES_FONDO = (r: number, g: number, b: number, a: number) =>
  a < 16 || (r > 242 && g > 242 && b > 242);

const recuadroDelProducto = (ctx: CanvasRenderingContext2D, ancho: number, alto: number) => {
  const { data } = ctx.getImageData(0, 0, ancho, alto);
  let x0 = ancho;
  let y0 = alto;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < alto; y++) {
    for (let x = 0; x < ancho; x++) {
      const i = (y * ancho + x) * 4;
      if (ES_FONDO(data[i], data[i + 1], data[i + 2], data[i + 3])) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  /* Nada distinto del fondo, o una mota: se usa la foto entera. */
  if (x1 < 0 || (x1 - x0) * (y1 - y0) < ancho * alto * 0.01) {
    return { x: 0, y: 0, w: ancho, h: alto };
  }
  return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
};

export const normalizeProductImage = async (file: File): Promise<File> => {
  const bitmap = await createImageBitmap(file);
  try {
    /* Una foto de 6000 px se analiza reducida: el recuadro sale igual y el
       navegador no se queda colgado recorriendo 36 millones de pixeles. */
    const reduccion = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
    const ancho = Math.round(bitmap.width * reduccion);
    const alto = Math.round(bitmap.height * reduccion);
    const origen = document.createElement('canvas');
    origen.width = ancho;
    origen.height = alto;
    const ctxOrigen = origen.getContext('2d', { willReadFrequently: true });
    if (!ctxOrigen) return file;
    ctxOrigen.drawImage(bitmap, 0, 0, ancho, alto);
    const caja = recuadroDelProducto(ctxOrigen, ancho, alto);

    const util = LADO * (1 - 2 * MARGEN);
    const escala = Math.min(util / caja.w, util / caja.h, MAX_ESCALA / reduccion);
    const w = caja.w * escala;
    const h = caja.h * escala;

    const destino = document.createElement('canvas');
    destino.width = LADO;
    destino.height = LADO;
    const ctx = destino.getContext('2d');
    if (!ctx) return file;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, LADO, LADO);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(origen, caja.x, caja.y, caja.w, caja.h, (LADO - w) / 2, (LADO - h) / 2, w, h);

    const blob = await new Promise<Blob | null>((resolve) =>
      destino.toBlob(resolve, 'image/jpeg', 0.9),
    );
    if (!blob) return file;
    const nombre = file.name.replace(/\.[^.]+$/, '') || 'producto';
    return new File([blob], `${nombre}.jpg`, { type: 'image/jpeg' });
  } finally {
    bitmap.close();
  }
};
