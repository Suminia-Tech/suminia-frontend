'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { ArrowLeft, ArrowRight, Plus, Star, Trash2, Type } from 'react-feather';
import { toast } from 'react-toastify';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { ConfirmModal } from '@/shared/ui';

import { useRemoveImageMutation, useUpdateImageMutation } from '../../api/productsApi';
import { useImageUpload } from '../../hooks/useImageUpload';
import { MAX_PRODUCT_IMAGES } from '../../model/product.types';
import type { Product, ProductImage } from '../../model/product.types';

/* Galeria de un producto, en rejilla de seis huecos.

   Los huecos vacios se pintan igual que los llenos en vez de esconderse tras un
   boton: asi se ve de un vistazo cuantas fotos caben todavia y cuantas faltan,
   que es la pregunta que se hace un proveedor mirando su catalogo a medias.

   La subida no es un input de archivo corriente: el navegador pide un permiso a
   nuestra API, manda el archivo directo a S3 y despues confirma. Ese baile vive
   en useImageUpload; aqui solo se llama upload(file). */

interface ProductImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const ProductImagesModal = ({ isOpen, onClose, product }: ProductImagesModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busyImageId, setBusyImageId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [editingAlt, setEditingAlt] = useState<string | null>(null);
  const [altDraft, setAltDraft] = useState('');

  const { upload, uploading, error, clearError } = useImageUpload(product.id);
  const [updateImage] = useUpdateImageMutation();
  const [removeImage] = useRemoveImageMutation();

  const images = [...product.images].sort((a, b) => a.position - b.position);
  const freeSlots = Math.max(0, MAX_PRODUCT_IMAGES - images.length);
  const isFull = freeSlots === 0;

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const ok = await upload(file, product.name);
    if (ok) toast.success('Imagen agregada');

    /* Se limpia el input para que elegir el mismo archivo otra vez vuelva a
       disparar onChange. */
    event.target.value = '';
  };

  /* Reordenar es intercambiar la posicion con el vecino. Se mandan las dos
     posiciones como el indice que les toca en el nuevo orden, en vez del valor
     que traian: asi una lista con posiciones repetidas —todas en 0, como queda
     si nadie las ha tocado— se va normalizando sola al primer movimiento. */
  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;

    const current = images[index];
    const neighbour = images[target];

    setBusyImageId(current.id);
    try {
      await updateImage({
        productId: product.id,
        imageId: current.id,
        data: { position: target },
      }).unwrap();
      await updateImage({
        productId: product.id,
        imageId: neighbour.id,
        data: { position: index },
      }).unwrap();
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo reordenar.'));
    } finally {
      setBusyImageId(null);
    }
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

  const startAlt = (image: ProductImage) => {
    setEditingAlt(image.id);
    setAltDraft(image.alt ?? '');
  };

  /* El texto alternativo describe la foto para quien no puede verla, y es lo
     que se lee si la imagen no carga. Se guarda aparte del resto porque se
     escribe mirando la foto, no en el formulario del producto. */
  const saveAlt = async () => {
    if (!editingAlt) return;

    setBusyImageId(editingAlt);
    try {
      await updateImage({
        productId: product.id,
        imageId: editingAlt,
        data: { alt: altDraft.trim() },
      }).unwrap();
      setEditingAlt(null);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo guardar la descripción.'));
    } finally {
      setBusyImageId(null);
    }
  };

  /* Borrar quita tambien el archivo de S3, de modo que no hay vuelta atras
     aunque la fila sea una baja logica. */
  const confirmRemove = async () => {
    if (!pendingDelete) return;

    setBusyImageId(pendingDelete);
    try {
      await removeImage({ productId: product.id, imageId: pendingDelete }).unwrap();
      toast.success('Imagen eliminada');
      setPendingDelete(null);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo eliminar la imagen.'));
    } finally {
      setBusyImageId(null);
    }
  };

  return (
    <Modal
      className='add-address-modal gallery-modal'
      centered
      isOpen={isOpen}
      toggle={onClose}
    >
      <ModalHeader toggle={onClose}></ModalHeader>

      <ModalBody>
        <div className='box-head'>
          <h3>Imágenes</h3>
        </div>
        <p className='font-light'>{product.name}</p>

        <p className='font-light gallery-hint'>
          Hasta {MAX_PRODUCT_IMAGES} imágenes. La primera es la que representa al
          producto en el catálogo; arrastra el orden con las flechas.
        </p>

        <div className='gallery-grid'>
          {images.map((image, index) => (
            <div
              className={`gallery-slot is-filled${busyImageId === image.id ? ' is-busy' : ''}`}
              key={image.id}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- las
                  imagenes viven en S3 y next/image exigiria declarar el dominio
                  del bucket en la configuracion. */}
              <img src={image.url} alt={image.alt ?? product.name} />

              {image.isPrimary && <span className='gallery-badge'>Principal</span>}

              <div className='gallery-actions'>
                <button
                  type='button'
                  title='Mover a la izquierda'
                  aria-label='Mover a la izquierda'
                  disabled={index === 0 || busyImageId === image.id}
                  onClick={() => move(index, -1)}
                >
                  <ArrowLeft size={13} />
                </button>
                <button
                  type='button'
                  title='Mover a la derecha'
                  aria-label='Mover a la derecha'
                  disabled={index === images.length - 1 || busyImageId === image.id}
                  onClick={() => move(index, 1)}
                >
                  <ArrowRight size={13} />
                </button>
                {!image.isPrimary && (
                  <button
                    type='button'
                    title='Marcar como principal'
                    aria-label='Marcar como principal'
                    disabled={busyImageId === image.id}
                    onClick={() => makePrimary(image.id)}
                  >
                    <Star size={13} />
                  </button>
                )}
                <button
                  type='button'
                  title='Describir la imagen'
                  aria-label='Describir la imagen'
                  disabled={busyImageId === image.id}
                  onClick={() => startAlt(image)}
                >
                  <Type size={13} />
                </button>
                <button
                  type='button'
                  className='is-danger'
                  title='Eliminar'
                  aria-label='Eliminar'
                  disabled={busyImageId === image.id}
                  onClick={() => setPendingDelete(image.id)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}

          {/* Los huecos que faltan, dibujados. El primero es el que dispara la
              carga; los demas quedan de aviso de cuanto cabe todavia. */}
          {Array.from({ length: freeSlots }).map((_, index) => (
            <button
              type='button'
              className='gallery-slot is-empty'
              key={`libre-${index}`}
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              <Plus size={20} />
              <span>{uploading && index === 0 ? 'Subiendo...' : 'Agregar'}</span>
            </button>
          ))}
        </div>

        {editingAlt && (
          <div className='gallery-alt'>
            <label className='form-label font-light'>
              Describe la imagen para quien no puede verla
            </label>
            <div className='d-flex gap-2'>
              <input
                type='text'
                className='form-control'
                placeholder='Tensiómetro digital con brazalete'
                value={altDraft}
                maxLength={255}
                onChange={(event) => setAltDraft(event.target.value)}
              />
              <button
                type='button'
                className='btn btn-primary rounded-1'
                disabled={busyImageId === editingAlt}
                onClick={saveAlt}
              >
                Guardar
              </button>
              <button
                type='button'
                className='btn btn-outline-secondary rounded-1'
                onClick={() => setEditingAlt(null)}
              >
                Cancelar
              </button>
            </div>
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

      {pendingDelete && (
        <ConfirmModal
          isOpen={Boolean(pendingDelete)}
          onClose={() => setPendingDelete(null)}
          onConfirm={confirmRemove}
          isLoading={busyImageId === pendingDelete}
          title='¿Eliminar esta imagen?'
          confirmLabel='Sí, eliminar'
        >
          <p className='mb-0'>
            El archivo se borra del almacenamiento y no se puede recuperar.
            {images.length === 1
              ? ' Es la única que tiene el producto: quedará sin foto en el catálogo.'
              : images.find((image) => image.id === pendingDelete)?.isPrimary
                ? ' Es la principal, así que la siguiente ocupará su lugar.'
                : ''}
          </p>
        </ConfirmModal>
      )}

      <ModalFooter className='pt-0 d-flex justify-content-between align-items-center'>
        <span className='font-light'>
          {images.length} de {MAX_PRODUCT_IMAGES}
          {isFull && ' · sin espacio, retira alguna para subir otra'}
        </span>
        <button
          type='button'
          className='btn btn-outline-secondary rounded-1'
          onClick={onClose}
        >
          Cerrar
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ProductImagesModal;
