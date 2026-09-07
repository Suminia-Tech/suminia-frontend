import Link from 'next/link';
import { Image as ImageIcon } from 'react-feather';

import { formatPriceRange, getPrimaryImage } from '../../lib/productLabels';
import type { Product } from '../../model/product.types';
import { Price } from './Price';

/* La tarjeta de producto, una sola para los tres sitios que la pintan: el
   catalogo publico, el del comprador y la portada. Estaba copiada en los tres y
   ya se habian separado.

   Que lleva y por que. Quien compra insumos medicos no reconoce un producto por
   la foto —un frasco blanco se parece a otro frasco blanco— sino por lo que
   dice al lado:

     - el principio activo con su concentracion, que es como se pide un
       medicamento cuando da igual la marca;
     - cuantos formatos hay, que anticipa si existe la presentacion que necesita
       antes de entrar;
     - cuantos proveedores lo venden, que es la razon de estar en un mercado y
       no en una tienda.

   El titulo se corta a dos lineas y el precio se ancla abajo: si no, un nombre
   largo empuja el precio y las tarjetas de una misma fila dejan de alinearse. */

interface ProductCardProps {
  product: Product;
  /** A donde lleva. Cambia entre el area del comprador y lo publico. */
  href: string;
}

const principiosResumen = (product: Product): string | null => {
  const principios = product.catalogMedicine?.principiosActivos;
  if (!principios || principios.length === 0) return null;

  return principios
    .map((principio) =>
      [principio.nombre, principio.cantidad, principio.unidad]
        .filter(Boolean)
        .join(' '),
    )
    .join(' + ');
};

export const ProductCard = ({ product, href }: ProductCardProps) => {
  const image = getPrimaryImage(product);
  const principios = principiosResumen(product);
  const formatos = product.presentations.length;

  return (
    <Link href={href} className='catalog-card'>
      <div className='catalog-card-media'>
        {image ? (
          /* eslint-disable-next-line @next/next/no-img-element -- las imagenes
             viven en S3 y next/image exigiria declarar el dominio del bucket en
             la configuracion. */
          <img src={image.url} alt={image.alt ?? product.name} />
        ) : (
          <ImageIcon size={22} />
        )}

        {/* Solo los medicamentos se marcan: son la minoria y la distincion
            importa. Etiquetar tambien los insumos, que son casi todo, seria
            repetir lo evidente en cada tarjeta. */}
        {product.type === 'MEDICINE' && (
          <span className='catalog-card-tag'>Medicamento</span>
        )}
      </div>

      <div className='catalog-card-body'>
        <h5>{product.name}</h5>

        {/* Para un medicamento, esto pesa mas que el nombre comercial: es como
            se pide cuando da igual la marca. */}
        {principios && <p className='catalog-card-principios'>{principios}</p>}

        <p className='font-light catalog-card-supplier'>
          {product.organizationName ?? 'Proveedor'}
        </p>

        <div className='catalog-card-foot'>
          <strong>{formatPriceRange(product) ?? <Price value={null} />}</strong>

          <span className='catalog-card-meta font-light'>
            {formatos === 1 ? '1 formato' : `${formatos} formatos`}
            {product.categoryName ? ` · ${product.categoryName}` : ''}
          </span>

          {product.offerCount > 1 && (
            <span className='catalog-card-offers'>
              {product.offerCount} proveedores lo venden
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
