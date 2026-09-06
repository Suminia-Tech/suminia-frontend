import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { OrganizationStatus } from './organization.types';

/* Estado de la tabla: busqueda, pagina y filtro. Vive en el store y no en el
   componente para que la pantalla de proveedores y la de compradores compartan
   el mismo comportamiento, y para que volver al listado desde un detalle no
   pierda la posicion. */

export interface OrganizationsFilters {
  search: string;
  status: OrganizationStatus | '';
  page: number;
}

const initialState: OrganizationsFilters = {
  search: '',
  status: '',
  page: 1,
};

const organizationsSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    // Cambiar la búsqueda o el filtro vuelve a la primera página: quedarse en
    // la 4 tras filtrar suele dejar la tabla vacía sin motivo aparente.
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setStatusFilter: (state, action: PayloadAction<OrganizationStatus | ''>) => {
      state.status = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const { setSearch, setStatusFilter, setPage, resetFilters } =
  organizationsSlice.actions;
export default organizationsSlice.reducer;
