# ─── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

# Copia lockfiles e instala deps
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copia el resto y genera el build standalone
COPY . .
RUN pnpm build

# ─── Stage 2: Runner ────────────────────────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

# Solo copiamos lo estrictamente necesario
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./

ENV NODE_ENV=production
EXPOSE 3000

# El entrypoint creado por output: 'standalone' es server.js
CMD ["node", "server.js"]
