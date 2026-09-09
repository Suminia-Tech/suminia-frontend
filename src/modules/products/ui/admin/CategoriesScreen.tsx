'use client';

import { useState, type FormEvent } from 'react';
import { Check, Edit2, Plus, Trash2, X } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage, extractFieldErrors } from '@/shared/lib/apiError';
import { ConfirmModal } from '@/shared/ui';

import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from '../../api/productsApi';
import type { ProductCategory } from '../../model/product.types';

/* La taxonomia del catalogo, que hasta ahora solo se podia tocar metiendo filas
   en la base a mano.

   Se editan en linea y no en un modal: son tres campos y la lista entera cabe
   en pantalla, de modo que abrir una ventana encima para cambiar un nombre
   seria mas ceremonia que trabajo.

   El identificador se enseña siempre, aunque nadie lo escriba: de el cuelgan la
   URL con la que se filtra el catalogo y el archivo de la ilustracion que la
   portada busca —desinfeccion.svg para "desinfeccion"—, y sin verlo no hay
   forma de saber que archivo hace falta. */

interface Draft {
  name: string;
  slug: string;
  position: string;
}

const EMPTY: Draft = { name: '', slug: '', position: '' };

const toDraft = (category: ProductCategory): Draft => ({
  name: category.name,
  slug: category.slug,
  position: String(category.position),
});

export const CategoriesScreen = () => {
  const { data, isLoading, isError, error } = useGetCategoriesQuery();
  const categories = data?.data ?? [];

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isSaving }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNew, setNew] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<ProductCategory | null>(null);

  const set = (field: keyof Draft) => (value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const cancel = () => {
    setEditingId(null);
    setNew(false);
    setDraft(EMPTY);
    setErrors({});
  };

  const startCreate = () => {
    setEditingId(null);
    setNew(true);
    setDraft(EMPTY);
    setErrors({});
  };

  const startEdit = (category: ProductCategory) => {
    setNew(false);
    setEditingId(category.id);
    setDraft(toDraft(category));
    setErrors({});
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (!draft.name.trim()) {
      return setErrors({ name: 'Escribe el nombre' });
    }

    try {
      if (editingId) {
        await updateCategory({
          id: editingId,
          data: {
            name: draft.name.trim(),
            slug: draft.slug.trim() || undefined,
            position: draft.position ? Number(draft.position) : undefined,
          },
        }).unwrap();
        toast.success('Categoría actualizada');
      } else {
        await createCategory({
          name: draft.name.trim(),
          /* Vacio significa "derivalo del nombre", que es lo habitual. */
          slug: draft.slug.trim() || undefined,
          position: draft.position ? Number(draft.position) : undefined,
        }).unwrap();
        toast.success('Categoría creada');
      }
      cancel();
    } catch (err) {
      const fieldErrors = extractFieldErrors(err);
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length === 0) {
        toast.error(extractErrorMessage(err, 'No se pudo guardar la categoría.'));
      }
    }
  };

  const confirmRemove = async () => {
    if (!pendingDelete) return;

    try {
      await deleteCategory(pendingDelete.id).unwrap();
      toast.success('Categoría eliminada');
      setPendingDelete(null);
    } catch (err) {
      /* El backend explica por que no se puede —"tiene 5 productos, muevelos
         antes"— y ese mensaje es mas util que cualquiera que se escriba aqui. */
      toast.error(extractErrorMessage(err, 'No se pudo eliminar la categoría.'));
      setPendingDelete(null);
    }
  };

  /* Las celdas del formulario, no la fila: se usa igual para la categoria
     nueva y para la que se esta editando, que van en filas distintas. */
  const formCells = (
    <>
      <td>
        <input
          type='text'
          className='form-control'
          placeholder='Nombre'
          value={draft.name}
          onChange={(event) => set('name')(event.target.value)}
          autoFocus
        />
        {errors.name && <small className='text-danger'>{errors.name}</small>}
      </td>
      <td>
        <input
          type='text'
          className='form-control'
          placeholder='Se genera del nombre'
          value={draft.slug}
          onChange={(event) => set('slug')(event.target.value)}
        />
        {errors.slug && <small className='text-danger'>{errors.slug}</small>}
      </td>
      <td className='num'>
        <input
          type='number'
          min='0'
          className='form-control'
          placeholder='Final'
          value={draft.position}
          onChange={(event) => set('position')(event.target.value)}
        />
      </td>
      <td className='num font-light'>—</td>
      <td className='actions'>
        <div className='row-actions'>
          <button type='submit' title='Guardar' disabled={isCreating || isSaving}>
            <Check size={15} />
          </button>
          <button type='button' title='Cancelar' onClick={cancel}>
            <X size={15} />
          </button>
        </div>
      </td>
    </>
  );

  return (
    <section className='section-b-space'>
      <div className='container-fluid-lg'>
        <div className='box-head d-flex align-items-center justify-content-between'>
          <h3>Categorías del catálogo</h3>
          {!isNew && !editingId && (
            <button
              type='button'
              className='btn btn-primary rounded-1 btn-sm d-inline-flex align-items-center gap-1'
              onClick={startCreate}
            >
              <Plus size={15} />
              Nueva categoría
            </button>
          )}
        </div>

        <p className='font-light'>
          Son el vocabulario común del marketplace: las usan los proveedores para
          clasificar y los compradores para filtrar. El identificador es la URL
          del catálogo y el nombre del archivo de su ilustración.
        </p>

        {isLoading ? (
          <p className='font-light'>Cargando...</p>
        ) : isError ? (
          <div className='alert alert-danger'>
            {extractErrorMessage(error, 'No se pudieron cargar las categorías.')}
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className='catalog-panel'>
              <table className='catalog-table'>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Identificador</th>
                    <th className='num'>Orden</th>
                    <th className='num'>Productos</th>
                    <th className='actions'></th>
                  </tr>
                </thead>
                <tbody>
                  {isNew && (
                    <tr className='category-form-row'>{formCells}</tr>
                  )}

                  {categories.map((category) =>
                    editingId === category.id ? (
                      <tr key={category.id} className='category-form-row'>
                        {formCells}
                      </tr>
                    ) : (
                      <tr key={category.id}>
                        <td>
                          <strong>{category.name}</strong>
                        </td>
                        <td className='font-light'>
                          <code>{category.slug}</code>
                        </td>
                        <td className='num font-light'>{category.position}</td>
                        <td className='num font-light'>{category.productCount}</td>
                        <td className='actions'>
                          <div className='row-actions'>
                            <button
                              type='button'
                              title='Editar'
                              onClick={() => startEdit(category)}
                            >
                              <Edit2 size={15} />
                            </button>
                            {/* Con productos dentro el backend lo rechaza. El
                                boton no se esconde: enterarse de por que no se
                                puede es mas util que no poder intentarlo. */}
                            <button
                              type='button'
                              title='Eliminar'
                              onClick={() => setPendingDelete(category)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </form>
        )}
      </div>

      <ConfirmModal
        isOpen={pendingDelete !== null}
        title='Eliminar categoría'
        confirmLabel='Eliminar'
        onConfirm={confirmRemove}
        onClose={() => setPendingDelete(null)}
      >
        {pendingDelete && (
          <>
            <p>
              Se elimina <strong>{pendingDelete.name}</strong> del catálogo:
              dejará de aparecer al clasificar un producto y al filtrar.
            </p>
            {pendingDelete.productCount > 0 && (
              <p className='text-danger'>
                Tiene {pendingDelete.productCount}{' '}
                {pendingDelete.productCount === 1 ? 'producto' : 'productos'}.
                Hay que moverlos a otra categoría antes.
              </p>
            )}
          </>
        )}
      </ConfirmModal>
    </section>
  );
};

export default CategoriesScreen;
