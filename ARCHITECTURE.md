# Arquitectura

El frontend de Suminia se organiza en módulos verticales con capas ligeras. Cada módulo
es autocontenido y expone una única puerta pública. Este documento es la fuente de verdad
de las decisiones estructurales.

El proyecto partió de una plantilla comercial de e-commerce (Voxo). El código propio son
~1.500 líneas frente a las ~22.000 de la plantilla, de modo que la arquitectura está
pensada para que lo propio no se pierda entre lo heredado: la plantilla vive aislada en
`_template/` y se borra por partes.

---

## Capas

```
src/
├── app/          Rutas de Next. Sin lógica de negocio.
├── modules/      Módulos de negocio de Suminia
├── shared/       Transversal, sin lógica de negocio
├── store/        configureStore + hooks tipados
└── _template/    Plantilla Voxo en cuarentena. Solo se borra, no se mejora.
```

La regla de dependencia es una sola, y ESLint la hace cumplir:

```
app  →  modules  →  shared
```

---

## Módulos de negocio

Llevan el mismo nombre que los módulos del backend NestJS, de modo que `auth`, `products`
u `orders` significan lo mismo a ambos lados del stack.

```
src/modules/
├── auth/             ← autenticación (login, registro, verificación, contraseñas)
│
├── users/            ← usuarios de la plataforma y de cada empresa   (planificado)
├── organizations/    ← proveedores y compradores                    (planificado)
├── products/         ← producto: catálogo, filtros, detalle         (planificado)
├── orders/           ← pedidos entre comprador y proveedor          (planificado)
└── payments/         ← pagos y crédito                              (planificado)
```

### `organizations` consume dos módulos del backend

La correspondencia con el backend es uno a uno salvo en un caso:

| Backend | Frontend |
|---|---|
| `auth/` | `modules/auth/` |
| `users/` | `modules/users/` |
| `suppliers/` + `buyers/` | `modules/organizations/` |
| `products/` | `modules/products/` |
| `orders/` | `modules/orders/` |

En el backend, `suppliers` y `buyers` son dominios distintos: el proveedor gestiona
catálogo, el comprador gestiona checkout. En el frontend, en cambio, **comparten pantalla**
— la misma tabla, el mismo formulario, la misma validación de NIT y el mismo flujo de
aprobación, porque ambos se apoyan en la tabla `Organization`.

Por eso el frontend los consolida en un módulo con subcarpetas por variante, en lugar de
duplicar esas piezas en dos módulos que además no podrían compartirlas (un módulo no
importa otro módulo).

```
modules/organizations/
├── api/
│   ├── organizationsApi.ts        endpoints comunes (list, get, approve)
│   ├── suppliersApi.ts            → /suppliers del backend
│   └── buyersApi.ts               → /buyers del backend
├── model/
│   ├── organization.types.ts      Organization, OrganizationType, Status
│   ├── supplier.types.ts          Supplier = Organization + lo suyo
│   ├── buyer.types.ts             Buyer = Organization + lo suyo
│   └── organizationsSlice.ts      filtros, selección
├── lib/
│   ├── taxId.ts                   validación de NIT
│   └── organizationStatus.ts      etiquetas PENDING/ACTIVE
├── ui/
│   ├── common/                    OrganizationTable · OrganizationForm · StatusBadge
│   ├── supplier/                  SuppliersScreen · SupplierCatalogTab
│   └── buyer/                     BuyersScreen · BuyerOrdersTab
└── index.ts
```

Los tres archivos de `api/` reflejan la separación del backend, y `supplier.types.ts` /
`buyer.types.ts` tipan los campos propios de cada dominio. Rutas:

```
app/(main)/admin/suppliers/page.tsx      →  /admin/suppliers
app/(main)/supplier/products/page.tsx    →  /supplier/products
app/(main)/buyer/catalog/page.tsx        →  /buyer/catalog
```

### Un área por rol

**El primer segmento de la URL es el rol**, y cada área tiene su propio `layout.tsx`:

```
app/(main)/
├── _shell/          AreaShell · AreaHeader — el chasis, parametrizado por menu
├── supplier/        layout + guarda; su cuenta lleva barra lateral
├── buyer/           layout + guarda — catalogo a ancho completo
├── admin/           layout + guarda — personal interno de Suminia
├── (suminia)/       publico: registro, verificacion, recuperar contrasena
└── (template)/      demos de Voxo, con su chatarra de tienda aparte
```

Las URLs van en inglés como el resto del código —los módulos y los endpoints del backend
ya lo estaban—, y el español se queda para lo que lee el usuario.

Esto es lo que permite que ninguna pantalla pregunte quién la está viendo: **el rol ya
quedó decidido por la ruta**. El proveedor no tiene un carrito escondido tras un `if`,
simplemente su `layout` no se lo pasa a `AreaShell`.

La traducción rol → área vive en un solo sitio, `modules/auth/lib/area.ts`. `AreaGuard`
la usa para mandar a cada quien a la suya, y `getHomePath` decide dónde aterriza al
iniciar sesión y qué hace `/`.

**No hay `middleware.ts`.** La sesión vive en `localStorage`, que el servidor no puede
leer, de modo que la guarda es de cliente. No es la barrera de seguridad —esa la pone el
backend con 403 en cada endpoint— sino lo que evita pintar un panel ajeno. Mover el token
a una cookie permitiría comprobarlo antes de servir la página.

---

## Estructura de un módulo

Todos siguen exactamente el mismo diseño interno. **Los cinco nombres de primer nivel son
fijos** — `api`, `model`, `lib`, `hooks`, `ui` — y no se inventan otros. Dentro de cada uno
se anida libremente cuando el módulo crece:

```
organizations/
├── api/
│   ├── organizationsApi.ts
│   ├── suppliersApi.ts
│   └── buyersApi.ts
├── model/
│   ├── organization.types.ts
│   ├── supplier.types.ts
│   ├── buyer.types.ts
│   └── organizationsSlice.ts
├── lib/
│   ├── taxId.ts
│   └── organizationStatus.ts
└── ui/
    ├── common/          ← lo que comparten las dos pantallas
    ├── supplier/        ← lo propio del proveedor
    └── buyer/           ← lo propio del comprador
```

Las subcarpetas son la herramienta para separar variantes dentro de un módulo cuando el
frontend consolida varios dominios del backend en una misma pantalla. Lo común vive suelto
o en `common/`; lo propio de cada variante, en su subcarpeta.

El módulo de referencia hoy es `auth`, que al tener una sola variante no necesita anidar:

```
auth/
├── api/                                 ← endpoints RTK Query
│   └── authApi.ts
│
├── model/                               ← contrato del backend + estado
│   ├── auth.types.ts
│   └── authSlice.ts
│
├── lib/                                 ← funciones puras, sin React
│   ├── roleLabel.ts
│   ├── passwordForm.ts
│   └── labels.ts
│
├── hooks/                               ← hooks de React del módulo
│   ├── useAuth.ts
│   └── useAuthInitialize.ts
│
├── ui/                                  ← pantallas y piezas
│   ├── LoginModal.tsx
│   ├── RegisterSection.tsx
│   ├── ForgotPasswordSection.tsx
│   ├── ResetPasswordScreen.tsx
│   ├── VerifyEmailScreen.tsx
│   └── AuthInitializer.tsx
│
└── index.ts                             ← API pública (barrel)
```

---

## Reglas de capa

### `api/`

- Endpoints RTK Query inyectados en `shared/api/baseApi.ts` con `injectEndpoints`.
- **Nunca** se crea otra instancia de `createApi`, ni se usa axios o `fetch` suelto.
- Tipa request y response: `builder.mutation<LoginResponse, LoginRequest>`.
- Los efectos de una respuesta (persistir sesión, refrescar caché) van en
  `onQueryStarted`, no en el componente.

### `model/`

- `*.types.ts` tipa el contrato con el backend. Es la frontera donde de verdad se rompen
  las cosas, así que se escribe explícitamente en lugar de dejar `any`.
- `*Slice.ts` guarda **solo estado**. Ninguna llamada de red: eso vive en `api/`.

### `lib/`

- Funciones puras: validaciones, formateo, cálculos, etiquetas.
- Sin React, sin Redux, sin acceso a red. Comprobable sin montar componentes.

### `hooks/`

- Hooks propios del módulo, con `'use client'`.
- Leen el store con `useAppSelector` / `useAppDispatch` de `@/store/hooks`.

### `ui/`

- Pantallas (`…Screen.tsx`) y piezas (`ProductCard.tsx`).
- Aquí es donde vive `'use client'` — no en la página de `app/`.

### `index.ts`

- La única puerta del módulo. Lo que no se exporta aquí, no existe para el resto del
  proyecto.
- Permite reorganizar las tripas del módulo sin romper a nadie.

---

## `app/` y el App Router

En `app/` solo vive lo que el framework exige más el límite de cliente:

```
app/
├── layout.js            raíz del documento + metadata global
├── favicon.ico          Next genera solo el <link rel="icon">
├── providers.tsx        límite server/client: Redux + inicialización de sesión
├── page.js              /
├── api/                 ⚠ backend FALSO de la plantilla (se borra)
└── (main)/              grupo de rutas: envoltorio común (layout.js)
    ├── (suminia)/       rutas reales del producto
    │   ├── register/            → /register
    │   ├── forgot-password/     → /forgot-password
    │   ├── reset-password/      → /reset-password
    │   └── verify-email/        → /verify-email
    └── (template)/      demos de Voxo, se borran por partes
        ├── shop/ blog/ product/ voxo_plus/   → /shop/…, /blog/…
        └── page/                             → /page/cart, /page/checkout…
```

- **La ruta de carpetas es la URL.** Solo son especiales los nombres reservados: `page`,
  `layout`, `route`, `loading`, `error`, `not-found`.
- **Un nombre entre paréntesis es un grupo de rutas: no aparece en la URL.** Solo sirve
  para compartir layout y agrupar visualmente.
- **Rutas nuevas van siempre en `(suminia)/`**, con URL en kebab-case y sin el prefijo
  `/page/` que arrastra la plantilla.

### Anatomía de una página

Una página no lleva lógica. Declara metadata, lee `params`/`searchParams` y renderiza una
pantalla del módulo:

```tsx
// app/(main)/(suminia)/register/page.tsx  (publico, sin area)
import type { Metadata } from 'next';
import { RegisterSection } from '@/modules/auth';

export const metadata: Metadata = { title: 'Registrarse' };

export default function RegisterPage() {
  return <RegisterSection />;
}
```

La página se queda como Server Component; el `'use client'` baja hasta la pantalla. Una
pantalla que use `useSearchParams` necesita un `<Suspense>` en la página para no forzar el
renderizado dinámico de toda la ruta.

### Metadata

El layout raíz define `title.template = '%s | Suminia'`, así que cada página declara solo
su nombre (`title: 'Registrarse'` → `Registrarse | Suminia`).

**No usar `next/head` ni archivos `head.js`.** Son APIs del Pages Router y de Next 13.0,
ya retiradas; conviven mal con la Metadata API y producen `<title>` duplicados.

---

## Datos

Un solo camino: **RTK Query sobre `shared/api/baseApi.ts`**.

```
Pantalla (modules/*/ui)
  → hook generado (modules/*/api)
    → baseApi (shared/api)  ─ Authorization: Bearer ─→  Backend NestJS
  ← al resolverse:
      tokenStorage (shared/lib)   persiste la sesión
      dispatch(...)               actualiza el slice del módulo
```

- `baseApi` es el único `createApi` del proyecto. Inyecta la cabecera `Authorization`
  leyendo de `tokenStorage`.
- **`localStorage` solo se toca en `shared/lib/tokenStorage.ts`.** Ningún otro archivo.
- `shared/lib/apiError.ts` normaliza los errores: el backend responde con `errors` cuando
  falla el pipe de validación y con `error` cuando falla una regla de negocio.

### Rehidratación de la sesión

El estado arranca vacío para que el HTML del servidor y el del cliente coincidan. En el
cliente, `AuthInitializer` (montado en `providers.tsx`) despacha `hydrate`, que lee
`tokenStorage`. La bandera `hydrated` distingue "aún no sé" de "no autenticado", y evita
que las pantallas privadas parpadeen. También escucha el evento `storage` para
sincronizar entre pestañas.

---

## Estado

- `store/index.ts` — `configureStore` con el reducer de cada módulo y el de `baseApi`.
  Exporta `RootState` y `AppDispatch`.
- `store/hooks.ts` — `useAppDispatch` / `useAppSelector` tipados.

**Usar siempre los hooks de `@/store/hooks`**, nunca los de `react-redux` directamente.

---

## `shared/`

Transversal y sin lógica de negocio. Si algo sabe qué es un proveedor o cómo se aprueba
una orden, va en un módulo.

| Carpeta | Contenido |
|---|---|
| `api/` | `baseApi.ts` — cliente HTTP único |
| `lib/` | `tokenStorage.ts`, `validators.ts`, `apiError.ts` |
| `ui/` | `PasswordToggle`, `SubmitButton` |
| `config/` | `env.ts` — punto único de lectura de variables de entorno |
| `i18n/` | configuración de i18next (es / en / fr) |

Aquí suben las cosas cuando **dos módulos** las necesitan.

---

## Fronteras (forzadas por ESLint)

Implementadas con `no-restricted-imports` en `eslint.config.mjs`:

| Origen | Prohibido | Motivo |
|---|---|---|
| `modules/*` | `@/modules/*` | Un módulo no importa otro módulo |
| `shared/**` | `@/modules/*`, `@/_template/*` | `shared` no depende de nada de arriba |
| `app/**`, `store/**` | `@/modules/*/*` | Solo la API pública, no las tripas |

Si dos módulos necesitan lo mismo, sube a `shared/`. Si una pantalla necesita componer dos
módulos, se componen en `app/`.

---

## Cuándo introducir `entities/`

`shared/` no admite lógica de negocio, y un módulo no puede importar otro. Eso deja un
hueco: **una entidad de negocio que varios módulos necesitan** — por ejemplo
`Organization`, que hará falta en `organizations`, en `orders` (un pedido referencia a
comprador y proveedor) y en `products` (un producto pertenece a un proveedor).

La solución cuando llegue ese momento es una capa por debajo de los módulos:

```
app  →  modules  →  entities  →  shared
```

```
src/entities/organization/
├── model/organization.types.ts
├── lib/taxId.ts
├── ui/OrganizationTable.tsx
└── index.ts
```

Con dos reglas nuevas de ESLint: `entities/*` no importa `modules/*`, y no importa otra
entidad.

**El disparador es concreto: cuando un tercer módulo necesite la misma entidad.** Con dos
consumidores basta un módulo con subcarpetas — es menos estructura y la extracción
posterior es mecánica (mover archivos, añadir la regla, reescribir imports). Crear la capa
antes es pagar por adelantado una separación que todavía no sostiene nada.

Hasta entonces, la capa **no existe**: no se crea vacía "para cuando haga falta".

---

## Convenciones de nombres

```
<módulo>Api.ts                  → authApi.ts, productsApi.ts
<módulo>Slice.ts                → authSlice.ts
<dominio>.types.ts              → auth.types.ts, product.types.ts
<Pantalla>Screen.tsx            → ResetPasswordScreen.tsx
use<Algo>.ts                    → useAuth.ts, useCatalogFilters.ts
index.ts                        → API pública del módulo
```

- Carpetas de módulo en singular y en el idioma del backend: `auth`, `products`, `orders`.
- URLs en kebab-case: `/forgot-password`, no `/forgot_password`.

---

## TypeScript

- `strict: true` en el código nuevo.
- `allowJs: true` + `checkJs: false` deja la plantilla fuera del chequeo mientras existe.
- Código nuevo siempre en `.ts` / `.tsx`.
- TypeScript se mantiene en la línea 5.x: la 7 rompe el peer de `typescript-eslint` que
  trae `eslint-config-next` 16.

---

## `_template/`

La plantilla comercial Voxo (~22.000 líneas, 368 archivos) de la que partió el proyecto.
Sirve de andamio visual mientras se construyen las pantallas reales.

```
_template/
├── Components/   ~200 componentes de demo
├── Layout/       Layout1..Layout6 + header, footer, elementos
├── Data/         constantes de UI hardcodeadas
├── ApiData/      los JSON que alimentan el backend falso
├── Constant/     textos
├── Utils/        helpers
├── Config/       ThemeConfigSettings
└── ReduxToolkit/ 11 reducers heredados
```

Reglas:

- **No se refactoriza ni se corrige: se borra** conforme cada pantalla se reemplaza.
- Sus reglas de lint están apagadas a propósito, junto con las de
  `app/(main)/(template)/**` y `app/api/**`.
- Al reemplazar una pantalla demo: se borra su carpeta de `(template)/`, se crea la nueva
  en `(suminia)/`, y se eliminan los componentes de `_template/` que quedaron sin uso.
- `store/index.ts` todavía registra sus reducers. No agregar nuevos ahí.

### El backend falso

```
Componente de _template  →  getAPIData('/api/products')
  →  app/api/products/route.jsx  →  _template/ApiData/Product.json
```

Son 21 route handlers que devuelven JSON estático. No llegan al backend real. Al conectar
un módulo al backend, se borran los handlers y JSON que dejaron de usarse.

---

## Lo no evidente

- **`shared/` no puede importar de `_template/`, pero `modules/` sí puede** — de forma
  transitoria, y solo para los reducers heredados (por ejemplo `ModalReducer`, que
  controla el modal de login). Es deuda conocida: desaparece cuando esos reducers se
  reemplacen por estado propio del módulo.
- **Los componentes de la plantilla asumen que su consumidor es un Client Component.**
  Usan hooks sin declarar `'use client'` y funcionaban porque todas las páginas de Voxo lo
  eran. Al renderizarlos desde una página nueva (que es Server Component) hay que marcar
  el componente de plantilla con `'use client'`. Ya se hizo con `Layout6` y `BreadCrumb`.
- **Hay dos `<Provider store={store}>` anidados** — uno en `app/providers.tsx` y otro en
  `app/(main)/layout.js`. Es herencia de la plantilla y no rompe nada porque es la misma
  instancia del store, pero sobra uno.
- **`app/(main)/layout.js` es un Client Component.** Por eso las rutas de la plantilla
  funcionan sin declarar `'use client'` en cada pantalla.
- **No hay tests.** Durante los refactors, los tipos son la única red de seguridad; de ahí
  que `strict` no sea negociable en el código nuevo.

---

## Verificación

Antes de dar algo por terminado:

```bash
npx tsc --noEmit && pnpm lint && pnpm build
```

`pnpm lint` incluye las reglas de frontera, de modo que una violación de la arquitectura
falla igual que un error de sintaxis.
