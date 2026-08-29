'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { Star, Trash2, Upload } from 'react-feather';
import { toast } from 'react-toastify';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';

import { useRemoveImageMutation, useUpdateImageMutation } from '../../api/productsApi';
import { useImageUpload } from '../../hooks/useImageUpload';
import type { Product } from '../../model/product.types';

/* Galeria de un producto. La subida no es un input de archivo corriente: el
   navegador pide un permiso a nuestra API, manda el archivo directo a S3 y
   despues confirma. Ese baile vive en useImageUpload; aqui solo se llama
   upload(file).

   La imagen principal es la que representa al producto en los listados. Se
   marca una sola: el backend desmarca la anterior en la misma transaccion. */

interface ProductImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const ProductImagesModal = ({ isOpen, onClose, product }: ProductImagesModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busyImageId, setBusyImageId] = useState<string | null>(null);

  const { upload, uploading, error, clearError } = useImageUpload(product.id);
  const [updateImage] = useUpdateImageMutation();
  const [removeImage] = useRemoveImageMutation();

  const images = [...product.images].sort((a, b) => a.position - b.position);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const ok = await upload(file, product.name);
    if (ok) toast.success('Imagen agregada');

    /* Se limpia el input para que elegir el mismo archivo otra vez vuelva a
       disparar onChange. */
    event.target.value = '';
  };

  const makePrimary = async (imageId: string) => {
    setBusyImageId(imageId);
    try {
      await updateImage({
        productId: product.id,
        imageId,
        data: { isPrimary: true },
      }).unwrap();
      toast.success('Imagen principal actualizada');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo marcar como principal.'));
    } finally {
      setBusyImageId(null);
    }
  };

  const remove = async (imageId: string) => {
    setBusyImageId(imageId);
    try {
      await removeImage({ productId: product.id, imageId }).unwrap();
      toast.success('Imagen eliminada');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo eliminar la imagen.'));
    } finally {
      setBusyImageId(null);
    }
  };

  return (
    <Modal className='add-address-modal' centered isOpen={isOpen} toggle={onClose}>
      <ModalHeader toggle={onClose}></ModalHeader>

      <ModalBody>
        <div className='box-head'>
          <h3>Imágenes</h3>
        </div>
        <p className='font-light'>{product.name}</p>

        {images.length === 0 ? (
          <p className='font-light'>
            Este producto todavía no tiene imágenes. La primera que subas queda como
            principal.
          </p>
        ) : (
          <div className='row g-3'>
            {images.map((image) => (
              <div className='col-6 col-md-4' key={image.id}>
                <div className='product-image-tile'>
                  {/* eslint-disable-next-line @next/next/no-img-element -- las
                      imagenes viven en S3 y next/image exigiria declarar el
                      dominio del bucket en la configuracion. */}
                  <img src={image.url} alt={image.alt ?? product.name} />

                  {image.isPrimary && <span className='badge badge-success'>Principal</span>}

                  <div className='product-image-actions'>
                    {!image.isPrimary && (
                      <button
                        type='button'
                        className='btn btn-sm'
                        title='Marcar como principal'
                        disabled={busyImageId === image.id}
                        onClick={() => makePrimary(image.id)}
                      >
                        <Star size={14} />
                      </button>
                    )}
                    <button
                      type='button'
                      className='btn btn-sm text-danger'
                      title='Eliminar'
                      disabled={busyImageId === image.id}
                      onClick={() => remove(image.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className='alert alert-danger mt-3' onClick={clearError} role='presentation'>
            {error}
          </div>
        )}

        <input
          ref={inputRef}
          type='file'
          accept='image/jpeg,image/png,image/webp,image/gif'
          className='d-none'
          onChange={handleFile}
        />
      </ModalBody>

      <ModalFooter className='pt-0 text-end d-block'>
        <button
          type='button'
          className='btn btn-outline-secondary rounded-1 me-2'
          onClick={onClose}
        >
          Cerrar
        </button>
        <button
          type='button'
          className='btn btn-primary rounded-1 d-inline-flex align-items-center gap-1'
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={16} />
          {uploading ? 'Subiendo...' : 'Subir imagen'}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ProductImagesModal;
