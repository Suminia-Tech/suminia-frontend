# CLAUDE.md

Guía para Claude Code (claude.ai/code) al trabajar en este repositorio.

## Proyecto

**Suminia frontend** — marketplace B2B de medicamentos e insumos médicos. Next.js 16
(App Router) + React 19 + Redux Toolkit / RTK Query, en TypeScript. Gestor de paquetes:
**pnpm**.

El backend vive aparte (NestJS + Prisma + PostgreSQL) y se consume por HTTP:
`NEXT_PUBLIC_API_URL`, por defecto `http://localhost:8001`.

## Comandos

```bash
pnpm dev          # desarrollo
pnpm build        # build de producción (Turbopack)
pnpm start        # servir el build
pnpm lint         # ESLint, incluye las reglas de frontera
npx tsc --noEmit  # typecheck
```

Antes de dar algo por terminado: `npx tsc --noEmit && pnpm lint && pnpm build`.

No hay tests en el proyecto. Durante los refactors, los tipos son la única red de
seguridad.

## Arquitectura

Módulos verticales con capas ligeras. **`ARCHITECTURE.md` es la fuente de verdad** de las
decisiones estructurales — consúltalo antes de crear un módulo, una ruta o un endpoint.

```
src/
├── app/          Rutas de Next: page.tsx, layout.tsx, metadata. Sin lógica.
├── modules/      Módulos de negocio de Suminia (auth, catalog, suppliers, orders…)
├── shared/       Transversal, sin lógica de negocio (api, ui, lib, config, i18n)
├── store/        configureStore + hooks tipados
└── _template/    Plantilla Voxo en cuarentena. Solo se borra, no se mejora.
```

La regla de dependencia, forzada por ESLint:

```
app  →  modules  →  shared
```

Los módulos llevan el mismo nombre que los del backend NestJS, de modo que `auth`,
`catalog` u `orders` significan lo mismo a ambos lados del stack.

### Anatomía de un módulo

No inventar carpetas nuevas:

```
modules/<nombre>/
├── api/        endpoints RTK Query, vía baseApi.injectEndpoints
├── model/      tipos del dominio + slice de estado
├── lib/        funciones puras (validaciones, formateo, cálculos)
├── hooks/      hooks de React propios del módulo
├── ui/         pantallas (…Screen.tsx) y piezas (ProductCard.tsx)
└── index.ts    API pública ← lo único importable desde fuera
```

### Rutas

En el App Router **la ruta de carpetas es la URL**, y un nombre **entre paréntesis es un
grupo de rutas: no aparece en la URL**.

```
app/(main)/(suminia)/   ← rutas reales del producto
app/(main)/(template)/  ← demos de Voxo, se borran por partes
```

**Rutas nuevas van siempre en `(suminia)/`**, con URL en kebab-case y sin el prefijo
`/page/` que arrastra la plantilla.

## Reglas (forzadas por ESLint, no son sugerencias)

1. **Un módulo nunca importa otro módulo.** Si dos lo necesitan, sube a `shared/`.
2. **Nada entra a las tripas de un módulo.** Solo `@/modules/<nombre>`, nunca
   `@/modules/<nombre>/model/...`. Dentro del módulo se usan rutas relativas.
3. **`shared/` no depende de `modules/` ni de `_template/`.**
4. **`app/*/page.tsx` no lleva lógica.** Declara metadata, lee `params`/`searchParams` y
   renderiza una pantalla del módulo. El `'use client'` baja hasta la pantalla.

## Convenciones

- **Datos: un solo camino.** RTK Query sobre `shared/api/baseApi.ts`, con
  `injectEndpoints` desde cada módulo. No crear otras instancias de `createApi`, ni usar
  axios o `fetch` sueltos en componentes.
- **`localStorage` solo en `shared/lib/tokenStorage.ts`.** Ningún otro archivo lo toca.
- **Tipar el contrato del backend** en `model/*.types.ts` del módulo. Es la frontera donde
  de verdad se rompen las cosas.
- **Estado:** usar `useAppDispatch` / `useAppSelector` de `@/store/hooks`, no los de
  `react-redux`.
- **TypeScript:** `strict: true` en el código nuevo; `allowJs` + `checkJs: false` deja la
  plantilla fuera del chequeo. Código nuevo siempre en `.ts` / `.tsx`.
- **Metadata:** el layout raíz define `title.template = '%s | Suminia'`, así que cada
  página declara solo su nombre (`title: 'Registrarse'`). No usar `next/head` ni archivos
  `head.js`: son APIs retiradas y duplican el `<title>`.
- **Comentarios:** un bloque explicando el *porqué* donde la decisión no sea obvia, no
  narración línea a línea. Sin emojis.

## `_template/`

La plantilla comercial Voxo (~22.000 líneas) de la que partió el proyecto. Sirve de
andamio visual mientras se construyen las pantallas reales.

- No se refactoriza ni se corrige: se **borra** conforme cada pantalla se reemplaza.
- Sus reglas de lint están apagadas a propósito en `eslint.config.mjs`, junto con las de
  `app/(main)/(template)/**` y `app/api/**`.
- Al reemplazar una pantalla demo: se borra su carpeta de `(template)/`, se crea la nueva
  en `(suminia)/`, y se eliminan los componentes de `_template/` que quedaron sin uso.
- `store/index.ts` todavía registra 11 reducers de la plantilla. No agregar nuevos ahí.
- `app/api/` + `_template/ApiData/` son un backend falso: 21 handlers que devuelven JSON
  estático. Al conectar un módulo al backend real, se borran los que dejaron de usarse.

## Lo no evidente

- **Los componentes de la plantilla asumen que su consumidor es un Client Component.**
  Usan hooks sin declarar `'use client'`. Al renderizarlos desde una página nueva (que es
  Server Component) hay que marcarlos con `'use client'` — ya se hizo con `Layout6` y
  `BreadCrumb`.
- **Una pantalla que use `useSearchParams` necesita `<Suspense>` en la página**, o Next
  fuerza el renderizado dinámico de toda la ruta.
- **Hay dos `<Provider store={store}>` anidados**, en `app/providers.tsx` y en
  `app/(main)/layout.js`. Herencia de la plantilla; no rompe nada porque es la misma
  instancia, pero sobra uno.
- **TypeScript se queda en la línea 5.x.** La 7 rompe el peer de `typescript-eslint` que
  trae `eslint-config-next` 16.
- **`package.json` todavía se llama `voxo`.** Resto de la plantilla, pendiente de renombrar.
