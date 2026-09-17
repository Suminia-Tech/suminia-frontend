import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { tokenStorage } from '@/shared/lib/tokenStorage';

import type { AuthState, User } from './auth.types';

/* Solo estado de sesion. Las llamadas al backend viven en api/authApi.ts, que
   es el unico camino de datos de auth; antes habia thunks aqui que duplicaban
   esos mismos endpoints con rutas ya desactualizadas. */

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  hydrated: false,
  loggingOut: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Restaura la sesion persistida al montar la app en el cliente. */
    hydrate: (state) => {
      state.user = tokenStorage.getUser<User>();
      state.isAuthenticated = tokenStorage.isAuthenticated();
      state.hydrated = true;
    },
    /** La establece el login tras persistir los tokens. */
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.hydrated = true;
    },
    logout: (state) => {
      tokenStorage.clear();
      state.user = null;
      state.isAuthenticated = false;
    },
    /* El velo de cerrar sesion. Va en el estado y no dentro del componente que
       tiene el boton porque ese componente desaparece al cerrar —la cabecera
       del area, el panel del proveedor— y se llevaria el velo con el. */
    logoutStarted: (state) => {
      state.loggingOut = true;
    },
    logoutFinished: (state) => {
      state.loggingOut = false;
    },
  },
});

export const {
  hydrate,
  setCredentials,
  logout,
  logoutStarted,
  logoutFinished,
} = authSlice.actions;
export default authSlice.reducer;
