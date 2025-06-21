# Etapa de construcción
FROM node:18-alpine AS builder

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install

# Copiar el resto de archivos
COPY . .

# Aumentar el timeout y construir la aplicación sin generación estática
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max_old_space_size=4096"
ENV NEXT_STATIC_EXPORT=false
ENV NEXT_EXPORT=false
ENV NEXT_DISABLE_STATIC_GENERATION=true
ENV NEXT_BUILD_STANDALONE=true
ENV NEXT_STANDALONE=true
RUN pnpm run build

# Etapa de producción
FROM node:18-alpine AS runner

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Establecer a producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_STATIC_EXPORT=false
ENV NEXT_EXPORT=false
ENV NEXT_DISABLE_STATIC_GENERATION=true
ENV NEXT_STANDALONE=true

# Copiar archivos necesarios desde la etapa de construcción
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["pnpm", "start"]
