# Suminia Frontend

B2B marketplace for medical supplies and equipment. Next.js 16 App Router frontend using
vertical modules with light layers, React 19, Redux Toolkit / RTK Query, and TypeScript.

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment
cp .env.example .env.local

# 3. Start the backend (separate repository)
#    See suminia-backend README — it must be running on port 8001

# 4. Start development server
pnpm dev
```

The app runs at `http://localhost:3000` and talks to the API at `http://localhost:8001`.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Quality & Code](#quality--code)
- [Architecture](#architecture)
- [Available Commands](#available-commands)
- [Routes](#routes)
- [Test Accounts](#test-accounts)
- [Deployment](#deployment)
- [License](#license)

## Overview

Suminia is a B2B marketplace connecting suppliers (manufacturers, importers) with buyers
(clinics, hospitals, distributors) of medicines and medical supplies in Colombia.

This repository is the web frontend. It is organized in vertical business modules that
mirror the backend's NestJS modules — `auth`, `catalog`, `orders` mean the same thing on
both sides of the stack. Boundaries between layers are enforced by ESLint, not convention.

The project started from a commercial e-commerce template (Voxo). That template is
quarantined under `src/_template/` and is deleted screen by screen as real ones replace
it. See [ARCHITECTURE.md](./ARCHITECTURE.md) for the retirement plan.

## Features

- **Authentication**: login, company registration, email verification, password reset
- **Role-Aware UI**: header and screens react to the signed-in role (supplier/buyer,
  admin/operator)
- **Vertical Modules**: each business area owns its api / model / lib / hooks / ui
- **Enforced Boundaries**: ESLint rejects cross-module imports and reaching into module
  internals
- **Single Data Path**: one RTK Query client, injected by each module
- **Typed Backend Contract**: request/response DTOs declared per module
- **Internationalization**: i18next with Spanish (default), English and French
- **Docker Support**: multi-stage build producing a Next standalone image

## Tech Stack

- **Runtime**: Node.js 20 + pnpm package manager
- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI Library**: React 19
- **Language**: TypeScript 5.9 (strict on new code)
- **State & Data**: Redux Toolkit 2 + RTK Query
- **Styling**: Sass + Bootstrap 5 / reactstrap
- **i18n**: i18next / react-i18next
- **Notifications**: react-toastify
- **Linting**: ESLint 9 (flat config) with `eslint-config-next`
- **Process Manager**: PM2 (production), Docker as an alternative

## Project Structure

```
├── src/
│   ├── app/                # Next.js App Router — routes only, no business logic
│   │   ├── layout.js       # Root layout + global metadata
│   │   ├── providers.tsx   # Server/client boundary: Redux + session bootstrap
│   │   ├── api/            # Template mock backend (21 handlers, to be deleted)
│   │   └── (main)/
│   │       ├── (suminia)/  # Real product routes
│   │       └── (template)/ # Voxo demo routes, deleted piece by piece
│   ├── modules/            # Business modules (auth, catalog, suppliers, orders…)
│   │   └── auth/           # api/ model/ lib/ hooks/ ui/ index.ts
│   ├── shared/             # Cross-cutting, no business logic
│   │   ├── api/            # baseApi — the single HTTP client
│   │   ├── lib/            # tokenStorage, validators, apiError
│   │   ├── ui/             # Reusable components
│   │   ├── config/         # Environment variables
│   │   └── i18n/           # i18next configuration and locales
│   ├── store/              # configureStore + typed hooks
│   └── _template/          # Voxo template in quarantine (delete-only)
├── public/                 # Static assets and Sass sources
├── ARCHITECTURE.md         # Structural source of truth
├── CLAUDE.md               # Conventions and commands
├── Dockerfile              # Multi-stage production image
└── ecosystem.config.js     # PM2 process definition
```

The dependency rule, enforced by ESLint:

```
app  →  modules  →  shared
```

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 20+
- pnpm (install with `npm install -g pnpm`)
- The Suminia backend running locally (see its README)
- Docker (optional, for the containerized build)

## Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:Suminia-Tech/suminia-frontend.git
   cd suminia-frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and point `NEXT_PUBLIC_API_URL` at your backend.

4. **Start the development server**

   ```bash
   pnpm dev
   ```

## Configuration

Environment variables live in `.env.local` (git-ignored). See `.env.example`.

```bash
# Backend API
# Any variable consumed by the browser must be prefixed NEXT_PUBLIC_.
NEXT_PUBLIC_API_URL=http://localhost:8001
```

Environment variables are read in a single place — `src/shared/config/env.ts`. Do not read
`process.env` anywhere else.

## Running the Application

```bash
# Development (hot reload)
pnpm dev

# Production build
pnpm build

# Serve the production build
pnpm start
```

## Quality & Code

```bash
# Lint, including the architecture boundary rules
pnpm lint

# Type check (no emit)
npx tsc --noEmit

# Build the application
pnpm build
```

Before considering anything finished:

```bash
npx tsc --noEmit && pnpm lint && pnpm build
```

A boundary violation fails `pnpm lint` exactly like a syntax error would. There are no
tests in the project yet — types are the safety net during refactors.

## Architecture

For structure, module anatomy, and data flow, see:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — layers, module structure, layer rules, App
  Router conventions, data flow, the template retirement plan
- **[CLAUDE.md](./CLAUDE.md)** — conventions, commands, and the non-obvious bits

Every business module follows the same internal layout:

```
modules/<name>/
├── api/        RTK Query endpoints, via baseApi.injectEndpoints
├── model/      Domain types + state slice
├── lib/        Pure functions (validation, formatting, calculations)
├── hooks/      React hooks owned by the module
├── ui/         Screens (…Screen.tsx) and pieces (ProductCard.tsx)
└── index.ts    Public API ← the only thing importable from outside
```

## Available Commands

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `pnpm dev`         | Start development server                     |
| `pnpm build`       | Production build (Turbopack)                 |
| `pnpm start`       | Serve the production build                   |
| `pnpm lint`        | Lint, including boundary rules               |
| `npx tsc --noEmit` | Type check                                   |

## Routes

Product routes live in the `(suminia)` route group. Names in parentheses are Next route
groups — they never appear in the URL.

| Route              | Description                                       |
| ------------------ | ------------------------------------------------- |
| `/`                | Home                                              |
| `/register`        | Company registration (buyer or supplier)          |
| `/forgot-password` | Request a password reset link                     |
| `/reset-password`  | Set a new password (arrives with `?token=`)       |
| `/verify-email`    | Verify email address (arrives with `?token=`)     |

Login has no route of its own: it is a modal available from anywhere in the app.

Routes under `/shop/…`, `/blog/…`, `/product/…`, `/voxo_plus/…` and `/page/…` are template
demos and will be removed.

## Test Accounts

Created by the backend seeder (`make db-seed` in `suminia-backend`). Their organizations
are already approved, so they can be used for end-to-end flows.

| Email | Password | Role |
| --- | --- | --- |
| `supplier_admin@example.com` | `SupAdm!n2026` | supplier_admin |
| `supplier_operator@example.com` | `SupOper!2026` | supplier_operator |
| `buyer_admin@example.com` | `BuyAdm!n2026` | buyer_admin |
| `buyer_operator@example.com` | `BuyOper!2026` | buyer_operator |
| `superuser@example.com` | `S3crEtP4ssw0rd!` | superuser |
| `admin@example.com` | `S3crEtP4ssw0rd!` | admin |

The header shows which account is active — "Mi cuenta (Administrador · Proveedor)" versus
"(Operador · Proveedor)" — which matters when testing several accounts in parallel.

## Deployment

The build produces a Next standalone output (`output: "standalone"` in
`next.config.mjs`), which ships only the dependencies the server actually needs.

**Docker** — multi-stage build, runs as a non-root user, with a healthcheck:

```bash
docker build -t suminia-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.example.com suminia-frontend
```

**PM2** — `ecosystem.config.js` defines the `suminia-frontend` process on port 3000.

CI/CD lives in `.github/workflows/deploy.yaml`.

> `NEXT_PUBLIC_*` variables are inlined at **build time**, not read at runtime. Changing
> the API URL requires rebuilding the image.

## License

Private and proprietary. This repository additionally contains a commercial template
(Voxo) under `src/_template/`, licensed to Suminia and not redistributable.
