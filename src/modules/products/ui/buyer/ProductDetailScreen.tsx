'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, Image as ImageIcon } from 'react-feather';
import { Col, Row, Table } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { useAppSelector } from '@/store/hooks';

import { useGetMedicineOffersQuery, useGetProductQuery } from '../../api/productsApi';
import { humanizeAttributeKey, toAttributePairs } from '../../lib/attributes';
import { lowestPrice } from '../../lib/priceTiers';
import { formatPrice } from '../../lib/productLabels';
import { taxLabel } from '../../lib/tax';

/* Ficha del producto que abre el comprador desde el catalogo.

   El backend decide que puede ver: un producto en borrador o de una empresa no
   habilitada responde 404, no 403, de modo que ni siquiera se filtra su
   existencia. Aqui basta con tratar el error como "no disponible".

   Los formatos se muestran en tabla y no como tarjetas: lo que el comprador
   compara es precio contra contenido, y una tabla alinea las cifras. */
export const ProductDetailScreen = ({ productId }: { productId: string }) => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const [activeImage, setActiveImage] = useState(0);

  const { data, isLoading, isError, error } = useGetProductQuery(productId, {
    skip: !hydrated,
  });

  /* Quien mas vende este mismo medicamento. Es lo que convierte la ficha en una
     comparacion: sin esto el comprador la lee y no sabe que hay otras cuatro
     empresas vendiendo exactamente lo mismo, mas barato o con stock. */
  const { data: offersData } = useGetMedicineOffersQuery(productId, {
    skip: !hydrated,
  });

  if (!hydrated || isLoading) {
    return (
      <section className='section-b-space'>
        <div className='container-fluid-lg'>
          <p className='font-light'>Cargando...</p>
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
          <Link href='/buyer/catalog' className='btn btn-primary rounded-1'>
            Volver al catálogo
          </Link>
        </div>
      </section>
    );
  }

  const product = data.data;
  const attributes = toAttributePairs(product.attributes);
  const invima = product.catalogMedicine;
  const offers = offersData?.data ?? [];
  const images = [...product.images].sort((a, b) => a.position - b.position);
  const cover = images[activeImage] ?? images[0] ?? null;

  /* Precio por unidad de contenido: es lo que revela que la caja x 100 sale
     mas barata que la de x 10, que a simple vista no se ve. */
  /* El CUM identifica cada presentacion comercial por separado, de modo que la
     columna solo aparece si alguna lo trae. */
  const tieneCum = product.presentations.some((presentation) => presentation.cum);

  const unitPrice = (price: number, quantity: number | null) =>
    quantity && quantity > 0 ? price / quantity : null;

  return (
    <section className='section-b-space'>
      <div className='container-fluid-lg'>
        <Link
          href='/buyer/catalog'
          className='font-light d-inline-flex align-items-center gap-1 mb-3'
        >
          <ChevronLeft size={16} />
          Volver al catálogo
        </Link>

        <Row className='g-4'>
          <Col lg='5'>
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

          <Col lg='7'>
            <div className='box-head'>
              <h3>{product.name}</h3>
            </div>

            <ul className='dashboard-profile'>
              <li className='dash-profile'>
                <span className='left font-light'>Proveedor</span>
                <span className='right'>{product.organizationName ?? '—'}</span>
              </li>
              <li className='dash-profile'>
                <span className='left font-light'>Categoría</span>
                <span className='right'>{product.categoryName ?? '—'}</span>
              </li>
              {product.brand && (
                <li className='dash-profile'>
                  <span className='left font-light'>Marca</span>
                  <span className='right'>{product.brand}</span>
                </li>
              )}
              {product.manufacturer && (
                <li className='dash-profile'>
                  <span className='left font-light'>Fabricante</span>
                  <span className='right'>{product.manufacturer}</span>
                </li>
              )}
              {/* Un 19% sobre una compra por volumen no es un detalle: el
                  comprador necesita saberlo antes de comparar precios. */}
              <li className='dash-profile'>
                <span className='left font-light'>IVA</span>
                <span className='right'>{taxLabel(product.taxCategory)}</span>
              </li>
            </ul>

            {/* Las caracteristicas del producto se mezclan con proveedor y
                categoria en la misma lista: para quien compara, el material o
                la esterilidad pesan tanto como la marca. */}
            {attributes.length > 0 && (
              <ul className='dashboard-profile'>
                {attributes.map((pair) => (
                  <li className='dash-profile' key={pair.key}>
                    <span className='left font-light'>
                      {humanizeAttributeKey(pair.key)}
                    </span>
                    <span className='right'>{pair.value}</span>
                  </li>
                ))}
              </ul>
            )}

            {product.description && (
              <p className='font-light mt-3'>{product.description}</p>
            )}
          </Col>
        </Row>

        {/* No lo escribio el proveedor: viene del registro del INVIMA, el mismo
            para todos los que vendan este medicamento. Para quien compra no es
            "una caracteristica mas", es lo que le dice si sirve para lo que
            necesita. */}
        {invima && (
          <>
            <div className='box-head mt-4'>
              <h3>Información del INVIMA</h3>
            </div>
            <ul className='dashboard-profile'>
              <li className='dash-profile'>
                <span className='left font-light'>Composición</span>
                <span className='right'>
                  {invima.principiosActivos
                    .map((principio) =>
                      [principio.nombre, principio.cantidad, principio.unidad]
                        .filter(Boolean)
                        .join(' '),
                    )
                    .join(' + ')}
                </span>
              </li>
              <li className='dash-profile'>
                <span className='left font-light'>Registro sanitario</span>
                <span className='right'>{invima.registroSanitario}</span>
              </li>
              {invima.formaFarmaceutica && (
                <li className='dash-profile'>
                  <span className='left font-light'>Forma farmacéutica</span>
                  <span className='right'>{invima.formaFarmaceutica}</span>
                </li>
              )}
              {invima.viasAdministracion.length > 0 && (
                <li className='dash-profile'>
                  <span className='left font-light'>Vía de administración</span>
                  <span className='right'>{invima.viasAdministracion.join(', ')}</span>
                </li>
              )}
              {invima.titular && (
                <li className='dash-profile'>
                  <span className='left font-light'>Titular del registro</span>
                  <span className='right'>{invima.titular}</span>
                </li>
              )}
              {invima.atc && (
                <li className='dash-profile'>
                  <span className='left font-light'>Clasificación ATC</span>
                  <span className='right'>
                    {invima.atc}
                    {invima.descripcionAtc ? ` · ${invima.descripcionAtc}` : ''}
                  </span>
                </li>
              )}
            </ul>
          </>
        )}

        {/* La razon de ser del maestro: el mismo medicamento, varios
            proveedores, un solo sitio para compararlos. */}
        {offers.length > 0 && (
          <>
            <div className='box-head mt-4'>
              <h3>
                Otros proveedores de este medicamento
                <span className='font-light'> · {offers.length}</span>
              </h3>
            </div>
            <ul className='medicine-offers'>
              {offers.map((offer) => (
                <li key={offer.productId}>
                  <Link href={`/buyer/catalog/${offer.productId}`}>
                    <span className='offer-supplier'>
                      <strong>{offer.organizationName ?? 'Proveedor'}</strong>
                      <small className='font-light'>
                        {offer.presentationCount}{' '}
                        {offer.presentationCount === 1 ? 'formato' : 'formatos'}
                        {offer.inStock ? '' : ' · sin existencias'}
                      </small>
                    </span>
                    <span className='offer-price'>
                      <small className='font-light'>desde</small>
                      <strong>{formatPrice(offer.fromPrice, offer.currency)}</strong>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className='box-head mt-4'>
          <h3>Formatos disponibles</h3>
        </div>

        <Table responsive className='align-middle'>
          <thead>
            <tr>
              <th>Formato</th>
              {tieneCum && <th>CUM</th>}
              <th>Empaque</th>
              <th>Contenido</th>
              <th>Pedido mínimo</th>
              <th>Precio</th>
              <th>Precio por unidad</th>
              <th>Disponible</th>
            </tr>
          </thead>
          <tbody>
            {product.presentations.map((presentation) => {
              /* Por unidad se calcula sobre el precio mas bajo alcanzable: si
                 hay descuento por volumen, comparar con el base haria parecer
                 caro un formato que no lo es. */
              const perUnit = unitPrice(
                lowestPrice(presentation.price, presentation.priceTiers),
                presentation.contentQuantity,
              );

              return (
                <tr key={presentation.id}>
                  <td>
                    {presentation.name}
                    {presentation.isDefault && (
                      <span className='badge badge-success ms-2'>Principal</span>
                    )}
                  </td>
                  {tieneCum && (
                    <td className='font-light'>{presentation.cum ?? '—'}</td>
                  )}
                  <td className='font-light'>{presentation.packaging}</td>
                  <td className='font-light'>
                    {presentation.contentQuantity
                      ? `${presentation.contentQuantity} ${presentation.contentUnit ?? ''}`.trim()
                      : '—'}
                  </td>
                  {/* Lo que de verdad se puede pedir, no solo el minimo: con
                      multiplo 5 el comprador no puede pedir 12. */}
                  <td className='font-light'>
                    {presentation.minOrderQuantity}
                    {presentation.orderMultiple > 1 &&
                      ` · de ${presentation.orderMultiple} en ${presentation.orderMultiple}`}
                  </td>
                  <td>
                    {formatPrice(presentation.price, presentation.currency)}
                    {/* La escala completa, no solo el precio base: el descuento
                        por volumen es lo que decide la compra en B2B, y
                        esconderlo obliga a preguntar por fuera. */}
                    {presentation.priceTiers.length > 0 && (
                      <ul className='tier-list'>
                        {presentation.priceTiers.map((tier) => (
                          <li key={tier.minQuantity}>
                            <span className='font-light'>
                              desde {tier.minQuantity}
                            </span>
                            {formatPrice(tier.price, presentation.currency)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className='font-light'>
                    {perUnit === null
                      ? '—'
                      : `${formatPrice(Math.round(perUnit), presentation.currency)} / ${
                          presentation.contentUnit ?? 'unidad'
                        }`}
                  </td>
                  <td className='font-light'>
                    {presentation.stock > 0 ? presentation.stock : 'Agotado'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </section>
  );
};
