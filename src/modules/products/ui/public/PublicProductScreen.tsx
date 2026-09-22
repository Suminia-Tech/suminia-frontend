'use client';

import Link from 'next/link';
import { useState, type ComponentType } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Lock,
  Package,
  Percent,
  ShieldOff,
  Truck,
} from 'react-feather';
import { Col, Row, Table } from 'reactstrap';

import { useMounted } from '@/shared/hooks/useMounted';
import { extractErrorMessage } from '@/shared/lib/apiError';
import { Breadcrumbs } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useGetMedicineOffersQuery } from '../../api/productsApi';
import { useCatalogProduct } from '../../hooks/useCatalogProducts';
import { humanizeAttributeKey, toDisplayPairs } from '../../lib/attributes';
import { formatPrice } from '../../lib/productLabels';
import { taxLabel } from '../../lib/tax';
import { Price } from '../common/Price';

/* La ficha que se ve sin haber entrado.

   Enseña todo lo que describe al producto —composicion, registro del INVIMA,
   formatos, contenido— y no enseña el precio, que es lo unico reservado. Esa
   es la idea: que se pueda comprobar que Suminia tiene lo que se busca antes
   de registrarse, y que para saber cuanto cuesta haga falta hacerlo.

   No hay lista de otros proveedores: ese endpoint pide sesion, y sin precios
   tampoco habria nada que comparar. */
/* La compra la pone el modulo del carrito, que products no puede importar: un
   modulo nunca importa otro. Entra como componente desde la pagina, que si
   puede ver los dos, y el tipo se describe con datos sueltos para que ninguno
   de los dos lados tenga que conocer los tipos del otro. */
export interface BuyableFormatProps {
  formats: {
    presentationId: string;
    name: string;
    packaging: string;
    price: number | null;
    currency: string;
    minOrderQuantity: number;
    orderMultiple: number;
    stock: number;
    priceTiers: { minQuantity: number; price: number }[];
  }[];
}

interface PublicProductScreenProps {
  productId: string;
  BuyBox?: ComponentType<BuyableFormatProps>;
}

export const PublicProductScreen = ({
  productId,
  BuyBox,
}: PublicProductScreenProps) => {
  const [activeImage, setActiveImage] = useState(0);
  const mounted = useMounted();
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data, isLoading, isError, error } = useCatalogProduct(productId);

  /* Quien mas vende este mismo medicamento. Solo con sesion: el endpoint la
     exige, y sin precios la comparacion no diria nada de todas formas. */
  const { data: offersData } = useGetMedicineOffersQuery(productId, {
    skip: !isAuthenticated,
  });
  const offers = offersData?.data ?? [];

  if (isLoading) {
    return (
      <section className='section-b-space'>
        <div className='container-fluid-lg'>
          <div className='product-detail-skeleton' aria-hidden='true'>
            <div className='product-detail-skeleton-media' />
            <div className='product-detail-skeleton-lines'>
              <span />
              <span />
              <span />
            </div>
          </div>
          <span className='visually-hidden'>Cargando el producto</span>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className='section-b-space'>
        <div className='container-fluid-lg'>
          <div className='alert alert-danger'>
            {extractErrorMessage(error, 'Este producto no está disponible.')}
          </div>
          <Link href='/catalog' className='btn btn-primary'>
            Volver al catálogo
          </Link>
        </div>
      </section>
    );
  }

  const product = data.data;
  const attributes = toDisplayPairs(product.attributes);
  const invima = product.catalogMedicine;
  const images = [...product.images].sort((a, b) => a.position - b.position);
  const cover = images[activeImage] ?? images[0] ?? null;
  const presentations = product.presentations;
  const conCum = presentations.some((p) => p.cum);

  /* El encabezado enseña desde cuanto sale, no el precio de un formato
     concreto: son varios y con reglas distintas, y elegir uno por el comprador
     seria decidir por el. El detalle lo da la caja de compra, que es donde se
     elige de verdad. */
  const precios = presentations
    .map((p) => p.price)
    .filter((price): price is number => price !== null);
  const desde = precios.length > 0 ? Math.min(...precios) : null;
  const variosPrecios = new Set(precios).size > 1;
  const moneda = presentations[0]?.currency ?? 'COP';

  const enStock = presentations.some((p) => p.stock > 0);
  const pedidoMinimo = presentations.reduce(
    (min, p) => Math.min(min, p.minOrderQuantity),
    Number.POSITIVE_INFINITY,
  );

  return (
    <section className='section-b-space'>
      <div className='container-fluid-lg'>
        {/* Las migas en vez del "Volver al catalogo" que habia: dicen de donde
            se sale y tambien donde se esta, que es lo que le faltaba a quien
            llega aqui desde un buscador y no desde el catalogo. */}
        <Breadcrumbs
          steps={[
            { label: 'Inicio', href: '/' },
            { label: 'Catálogo', href: '/catalog' },
            ...(product.categoryName
              ? [
                  {
                    label: product.categoryName,
                    href: `/catalog?categoryId=${product.categoryId}`,
                  },
                ]
              : []),
            { label: product.name },
          ]}
        />

        <Row className='g-4 g-lg-5'>
          <Col lg='6'>
            <div className='product-gallery'>
              <div className='product-gallery-main'>
                {cover ? (
                  /* eslint-disable-next-line @next/next/no-img-element -- las
                     imagenes viven en S3 y next/image exigiria declarar el
                     dominio del bucket en la configuracion. */
                  <img src={cover.url} alt={cover.alt ?? product.name} />
                ) : (
                  <ImageIcon size={32} />
                )}
              </div>

              {images.length > 1 && (
                <div className='product-gallery-thumbs'>
                  {images.map((image, index) => (
                    <button
                      type='button'
                      key={image.id}
                      aria-label={`Ver la imagen ${index + 1} de ${images.length}`}
                      aria-pressed={index === activeImage}
                      className={index === activeImage ? 'active' : undefined}
                      onClick={() => setActiveImage(index)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image.url} alt={image.alt ?? product.name} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Col>

          <Col lg='6'>
            <div className='product-detail'>
              <div className='product-detail-tags'>
                {product.categoryName && (
                  <Link
                    href={`/catalog?categoryId=${product.categoryId}`}
                    className='product-detail-category'
                  >
                    {product.categoryName}
                  </Link>
                )}
                <span
                  className={`product-detail-stock${enStock ? '' : ' is-out'}`}
                >
                  {enStock ? 'Disponible' : 'Sin existencias'}
                </span>
              </div>

              <h1 className='product-detail-title'>{product.name}</h1>

              <p className='product-detail-supplier'>
                Vendido por{' '}
                <strong>{product.organizationName ?? 'Proveedor'}</strong>
                {product.brand && (
                  <>
                    {' · '}
                    <span className='font-light'>Marca {product.brand}</span>
                  </>
                )}
              </p>

              {/* El precio arriba, pegado al titulo, como en cualquier ficha de
                  producto. Quien no puede verlo encuentra en su lugar la cifra
                  difuminada de `Price`, que dice que existe sin decir cual. */}
              <div className='product-detail-price'>
                {desde !== null ? (
                  <>
                    {variosPrecios && (
                      <span className='product-detail-price-from'>desde</span>
                    )}
                    <strong>{formatPrice(desde, moneda)}</strong>
                    <span className='font-light'>
                      {taxLabel(product.taxCategory)}
                    </span>
                  </>
                ) : (
                  <Price value={null} currency={moneda} />
                )}
              </div>

              {product.description && (
                <p className='product-detail-description font-light'>
                  {product.description}
                </p>
              )}

              {/* La llamada va aqui, junto a lo que falta, y no al final de la
                  pagina: es donde el visitante se topa con que no ve el precio.

                  Solo para quien no ha entrado. A quien ya tiene sesion y espera
                  aprobacion se lo cuenta la franja de arriba, y pedirle que
                  registre la empresa que acaba de registrar no tiene sentido.
                  Espera a `mounted` y a `hydrated`, no solo al segundo: la
                  sesion se lee de localStorage, que el servidor no ve, y
                  `hydrated` puede llegar encendido al primer render si por
                  encima hay una frontera de Suspense. Es lo que le pasaba al
                  catalogo. */}
              {BuyBox && (
                <BuyBox
                  formats={presentations.map((presentation) => ({
                    presentationId: presentation.id,
                    name: presentation.name,
                    packaging: presentation.packaging,
                    price: presentation.price,
                    currency: presentation.currency,
                    minOrderQuantity: presentation.minOrderQuantity,
                    orderMultiple: presentation.orderMultiple,
                    stock: presentation.stock,
                    priceTiers: presentation.priceTiers ?? [],
                  }))}
                />
              )}

              {mounted && hydrated && !isAuthenticated && (
                <div className='public-price-cta'>
                  <Lock size={17} />
                  <div>
                    <strong>¿Necesitas el precio?</strong>
                    <p className='font-light'>
                      Registra tu empresa y, en cuanto quede aprobada, verás los
                      precios y podrás pedir.
                    </p>
                    <Link
                      href='/register'
                      className='btn btn-primary btn-sm'
                    >
                      Registrar mi empresa
                    </Link>
                  </div>
                </div>
              )}

              {/* Las tres cosas que en B2B se preguntan siempre antes de pedir y
                  que hoy habia que ir a buscar a la tabla del pie. */}
              <ul className='product-detail-perks'>
                <li>
                  <Percent size={16} />
                  <span>{taxLabel(product.taxCategory)}</span>
                </li>
                <li>
                  <Package size={16} />
                  <span>
                    {presentations.length}{' '}
                    {presentations.length === 1 ? 'formato' : 'formatos'} de venta
                  </span>
                </li>
                <li>
                  <Truck size={16} />
                  <span>
                    {Number.isFinite(pedidoMinimo) && pedidoMinimo > 1
                      ? `Pedido mínimo ${pedidoMinimo}`
                      : 'Sin pedido mínimo'}
                  </span>
                </li>
              </ul>
            </div>
          </Col>
        </Row>

        {/* Todo lo que describe al producto, debajo y a lo ancho. Arriba va lo
            que hace falta para decidir la compra; aqui, lo que hace falta para
            comprobar que es el producto correcto. */}
        <div className='product-detail-sheet'>
          {(attributes.length > 0 || product.brand) && (
            <section className='product-detail-block'>
              <div className='box-head'>
                <h3>Especificaciones</h3>
              </div>
              <ul className='data-list'>
                {product.brand && (
                  <li>
                    <span className='font-light'>Marca</span>
                    <span>{product.brand}</span>
                  </li>
                )}
                {product.manufacturer && (
                  <li>
                    <span className='font-light'>Fabricante</span>
                    <span>{product.manufacturer}</span>
                  </li>
                )}
                {attributes.map((pair) => (
                  <li key={pair.key}>
                    <span className='font-light'>
                      {humanizeAttributeKey(pair.key)}
                    </span>
                    <span>{pair.value}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {invima && (
            <section className='product-detail-block'>
              <div className='box-head'>
                <h3>
                  <FileText size={18} className='me-2' />
                  Información del INVIMA
                </h3>
              </div>
              <ul className='data-list'>
                <li>
                  <span className='font-light'>Composición</span>
                  <span>
                    {invima.principiosActivos
                      .map((principio) =>
                        [principio.nombre, principio.cantidad, principio.unidad]
                          .filter(Boolean)
                          .join(' '),
                      )
                      .join(' + ')}
                  </span>
                </li>
                <li>
                  <span className='font-light'>Registro sanitario</span>
                  <span>{invima.registroSanitario}</span>
                </li>
                {invima.formaFarmaceutica && (
                  <li>
                    <span className='font-light'>Forma farmacéutica</span>
                    <span>{invima.formaFarmaceutica}</span>
                  </li>
                )}
                {invima.viasAdministracion.length > 0 && (
                  <li>
                    <span className='font-light'>Vía de administración</span>
                    <span>{invima.viasAdministracion.join(', ')}</span>
                  </li>
                )}
                {invima.titular && (
                  <li>
                    <span className='font-light'>Titular del registro</span>
                    <span>{invima.titular}</span>
                  </li>
                )}
              </ul>
            </section>
          )}

          <section className='product-detail-block'>
            <div className='box-head'>
              <h3>Formatos de venta</h3>
            </div>

            <Table responsive className='align-middle format-table'>
              <thead>
                <tr>
                  <th>Formato</th>
                  {conCum && <th>CUM</th>}
                  <th>Empaque</th>
                  <th>Contenido</th>
                  <th>Pedido mínimo</th>
                  <th>Existencias</th>
                  <th className='text-end'>Precio</th>
                </tr>
              </thead>
              <tbody>
                {presentations.map((presentation) => (
                  <tr key={presentation.id}>
                    <td>
                      <strong>{presentation.name}</strong>
                    </td>
                    {conCum && (
                      <td className='font-light'>{presentation.cum ?? '—'}</td>
                    )}
                    <td className='font-light'>{presentation.packaging}</td>
                    <td className='font-light'>
                      {presentation.contentQuantity
                        ? `${presentation.contentQuantity} ${presentation.contentUnit ?? ''}`.trim()
                        : '—'}
                    </td>
                    <td className='font-light'>
                      {presentation.minOrderQuantity}
                      {presentation.orderMultiple > 1 &&
                        ` · de ${presentation.orderMultiple} en ${presentation.orderMultiple}`}
                    </td>
                    <td className='font-light'>
                      {presentation.stock > 0 ? (
                        presentation.stock
                      ) : (
                        <span className='format-table-out'>
                          <ShieldOff size={13} /> agotado
                        </span>
                      )}
                    </td>
                    <td className='text-end'>
                      <Price
                        value={presentation.price}
                        currency={presentation.currency}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </section>

          {/* La razon de ser del maestro: el mismo medicamento, varios
              proveedores, un solo sitio para compararlos. */}
          {offers.length > 0 && (
            <section className='product-detail-block'>
              <div className='box-head'>
                <h3>
                  Otros proveedores de este medicamento
                  <span className='font-light'> · {offers.length}</span>
                </h3>
              </div>
              <ul className='medicine-offers'>
                {offers.map((offer) => (
                  <li key={offer.productId}>
                    <Link href={`/catalog/${offer.productId}`}>
                      <span className='offer-supplier'>
                        <strong>{offer.organizationName ?? 'Proveedor'}</strong>
                        <small className='font-light'>
                          {offer.presentationCount}{' '}
                          {offer.presentationCount === 1
                            ? 'formato'
                            : 'formatos'}
                          {offer.inStock ? '' : ' · sin existencias'}
                        </small>
                      </span>
                      <span className='offer-price'>
                        <small className='font-light'>desde</small>
                        <strong>
                          <Price
                            value={offer.fromPrice}
                            currency={offer.currency}
                          />
                        </strong>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </section>
  );
};

export default PublicProductScreen;
