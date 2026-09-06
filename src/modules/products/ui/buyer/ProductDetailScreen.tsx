'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, Image as ImageIcon } from 'react-feather';
import { Col, Row, Table } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { useAppSelector } from '@/store/hooks';

import { useGetProductQuery } from '../../api/productsApi';
import { humanizeAttributeKey, toAttributePairs } from '../../lib/attributes';
import { formatPrice } from '../../lib/productLabels';

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
  const images = [...product.images].sort((a, b) => a.position - b.position);
  const cover = images[activeImage] ?? images[0] ?? null;

  /* Precio por unidad de contenido: es lo que revela que la caja x 100 sale
     mas barata que la de x 10, que a simple vista no se ve. */
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

        <div className='box-head mt-4'>
          <h3>Formatos disponibles</h3>
        </div>

        <Table responsive className='align-middle'>
          <thead>
            <tr>
              <th>Formato</th>
              <th>Empaque</th>
              <th>Contenido</th>
              <th>Precio</th>
              <th>Precio por unidad</th>
              <th>Disponible</th>
            </tr>
          </thead>
          <tbody>
            {product.presentations.map((presentation) => {
              const perUnit = unitPrice(
                presentation.price,
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
                  <td className='font-light'>{presentation.packaging}</td>
                  <td className='font-light'>
                    {presentation.contentQuantity
                      ? `${presentation.contentQuantity} ${presentation.contentUnit ?? ''}`.trim()
                      : '—'}
                  </td>
                  <td>{formatPrice(presentation.price, presentation.currency)}</td>
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
