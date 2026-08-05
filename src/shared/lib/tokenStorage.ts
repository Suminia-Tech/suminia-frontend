/* Unico modulo del proyecto que toca localStorage para la sesion.
   Antes esto estaba repartido entre el interceptor de axios, prepareHeaders de
   RTK Query, el servicio de auth y el slice, y cada uno podia dejar la sesion
   en un estado distinto. */

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

const isBrowser = () => typeof window !== 'undefined';

export interface StoredSession<TUser> {
  accessToken: string;
  refreshToken: string;
  user: TUser;
}

export const tokenStorage = {
  getAccessToken(): string | null {
    return isBrowser() ? window.localStorage.getItem(ACCESS_TOKEN_KEY) : null;
  },

  getRefreshToken(): string | null {
    return isBrowser() ? window.localStorage.getItem(REFRESH_TOKEN_KEY) : null;
  },

  /* Devuelve null y limpia la sesion si el JSON guardado esta corrupto: es
     preferible pedir un login nuevo antes que arrastrar un usuario invalido. */
  getUser<TUser>(): TUser | null {
    if (!isBrowser()) return null;

    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as TUser;
    } catch {
      tokenStorage.clear();
      return null;
    }
  },

  save<TUser>({ accessToken, refreshToken, user }: StoredSession<TUser>): void {
    if (!isBrowser()) return;

    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear(): void {
    if (!isBrowser()) return;

    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return tokenStorage.getAccessToken() !== null;
  },
};
