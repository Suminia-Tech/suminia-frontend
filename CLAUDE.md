# Suminia Frontend

Marketplace B2B de medicamentos e insumos médicos. Next.js 16 (App Router) + React 19 +
Redux Toolkit + RTK Query, en TypeScript. El backend vive aparte (`NEXT_PUBLIC_API_URL`,
por defecto `http://localhost:8001`).

## Arquitectura

Módulos verticales con capas ligeras. Los módulos llevan el mismo nombre que los del
backend NestJS, de modo que `auth`, `catalog` u `orders` significan lo mismo a ambos
lados del stack. La regla de dependencia es una sola:

```
app  ->  modules  ->  shared
```

```
src/
├── app/          Rutas de Next: page.tsx, layout.tsx, metadata. Sin lógica.
├── modules/      Módulos de negocio de Suminia (auth, catalog, suppliers, orders…)
├── shared/       Transversal, sin lógica de negocio (api, ui, lib, config)
├── store/        configureStore + hooks tipados
└── _template/    Plantilla Voxo en cuarentena. Solo se borra, no se mejora.
```

### Cómo leer `app/`

En el App Router **la ruta de carpetas es la URL**, y solo son especiales los
nombres reservados: `page`, `layout`, `route`, `loading`, `error`, `not-found`.
Un nombre **entre paréntesis es un grupo de rutas: no aparece en la URL**, solo
sirve para compartir layout y para agrupar visualmente.

```
app/
├── layout.js            raíz del documento + metadata global
├── favicon.ico          Next genera solo el <link rel="icon">
├── providers.tsx        Redux + inicialización de sesión (límite cliente)
├── page.js              /
├── api/                 ⚠ backend FALSO: 21 handlers que devuelven
│                          los JSON de _template/ApiData. Se borran al
│                          conectar el backend real.
└── (main)/              grupo: envoltorio común (layout.js)
    ├── (suminia)/       ← rutas reales del producto
    │   ├── register/            → /register
    │   ├── forgot-password/     → /forgot-password
    │   ├── reset-password/      → /reset-password
    │   └── verify-email/        → /verify-email
    └── (template)/      ← demos de Voxo, se borran por partes
        ├── shop/ blog/ product/ voxo_plus/   → /shop/…, /blog/…
        └── page/                             → /page/cart, /page/checkout…
```

**Rutas nuevas van siempre en `(suminia)/`**, con URL en kebab-case y sin el
prefijo `/page/` que arrastra la plantilla.

En `app/` solo vive lo que el framework exige (`layout`, `page`, `route`,
`favicon.ico`) más `providers.tsx`. Todo lo demás va a `modules/` o `shared/`.

**Títulos:** el layout raíz define `title.template = '%s | Suminia'`, así que cada
página declara solo su nombre (`title: 'Registrarse'`). No usar `next/head` ni
archivos `head.js`: son APIs del Pages Router y de Next 13.0, retiradas.

### Anatomía de un módulo

Todos tienen la misma forma. No inventar carpetas nuevas:

```
modules/<nombre>/
├── api/        endpoints RTK Query, vía baseApi.injectEndpoints
├── model/      tipos del dominio + slice de estado
├── lib/        funciones puras (validaciones, formateo, cálculos)
├── hooks/      hooks de React propios del módulo
├── ui/         pantallas (…Screen.tsx) y piezas (ProductCard.tsx)
└── index.ts    API pública ← lo único importable desde fuera
```

### Reglas (forzadas por ESLint, no son sugerencias)

1. **Un módulo nunca importa otro módulo.** Si dos lo necesitan, sube a `shared/`.
2. **Nada entra a las tripas de un módulo.** Solo `@/modules/<nombre>`, nunca
   `@/modules/<nombre>/model/...`. Dentro del módulo se usan rutas relativas.
3. **`shared/` no depende de `modules/` ni de `_template/`.**
4. **`app/*/page.tsx` no lleva lógica.** Declara metadata, lee `params`/`searchParams`
   y renderiza una pantalla del módulo. El `'use client'` baja hasta la pantalla.

### Datos

- **Un solo camino:** RTK Query sobre `shared/api/baseApi.ts`. Cada módulo inyecta
  endpoints con `injectEndpoints`. No crear otras instancias de `createApi`, ni usar
  axios/fetch sueltos en componentes.
- **`localStorage` solo en `shared/lib/tokenStorage.ts`.** Ningún otro archivo lo toca.
- **Tipar el contrato del backend** en `model/*.types.ts` del módulo. Es la frontera
  donde de verdad se rompen las cosas.

## `_template/`

La plantilla comercial Voxo (~22.000 líneas) de la que partió el proyecto. Sirve de
andamio visual mientras se construyen las pantallas reales.

- No se refactoriza ni se corrige: se **borra** conforme cada pantalla se reemplaza.
- Sus reglas de lint están apagadas a propósito en `eslint.config.mjs`, junto con
  las de `app/(main)/(template)/**` y `app/api/**`.
- Al reemplazar una pantalla demo: se borra su carpeta de `(template)/`, se crea la
  nueva en `(suminia)/`, y se eliminan los componentes de `_template/` que quedaron
  sin uso.
- `store/index.ts` todavía registra reducers de la plantilla. No agregar nuevos ahí.
- `app/api/` + `_template/ApiData/` son el mock de backend. Al conectar un módulo al
  backend real, se borran los handlers y JSON que dejaron de usarse.

## TypeScript

- `strict: true` en el código nuevo; `allowJs` + `checkJs: false` deja la plantilla
  fuera del chequeo mientras existe.
- Código nuevo siempre en `.ts`/`.tsx`.
- Usar `useAppDispatch` / `useAppSelector` de `@/store/hooks`, no los de `react-redux`.

## Comandos

```bash
pnpm dev          # desarrollo
pnpm build        # build de producción (Turbopack)
pnpm lint         # ESLint, incluye las reglas de frontera
npx tsc --noEmit  # typecheck
```

Antes de dar algo por terminado: `npx tsc --noEmit && pnpm lint && pnpm build`.
