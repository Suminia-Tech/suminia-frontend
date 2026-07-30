# Imagen de produccion del frontend de Suminia (Next.js 16).

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.34.5 --activate
WORKDIR /app

# ---------------------------------------------------------------------------
# Dependencias
# ---------------------------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---------------------------------------------------------------------------
# Compilacion
#
# NEXT_PUBLIC_API_URL se incrusta en el bundle que corre en el navegador, por lo
# que debe estar presente durante el build y no en tiempo de ejecucion. Se
# recibe como argumento de construccion desde el pipeline. Consecuencia: la
# imagen queda ligada a la URL de la API con la que se construyo.
# ---------------------------------------------------------------------------
FROM deps AS builder
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN pnpm run build

# ---------------------------------------------------------------------------
# Runtime
#
# La salida standalone incluye su propio node_modules minimo, pero Next no
# copia public/ ni .next/static: hay que anadirlos a mano.
# ---------------------------------------------------------------------------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S -u 1001 -G nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/',r=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "server.js"]
