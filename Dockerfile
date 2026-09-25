# ============================================
# Stage 1: Dependencies
# ============================================

ARG NODE_VERSION=24.14.0-slim

FROM node:${NODE_VERSION} AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund


# ============================================
# Stage 2: Build
# ============================================

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DB_FILE_NAME=file:/app/data/database.db

RUN npm run build


# ============================================
# Stage 3: Database migrations
# ============================================

FROM node:${NODE_VERSION} AS migrator

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY package.json package-lock.json ./
COPY drizzle.config.ts ./
COPY migrations ./migrations

ENV NODE_ENV=production

CMD ["npx", "drizzle-kit", "migrate"]


# ============================================
# Stage 4: Production
# ============================================

FROM node:${NODE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=node:node /app/public ./public

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

RUN mkdir -p /app/data \
    && chown -R node:node /app/data

USER node

EXPOSE 3000

CMD ["node", "server.js"]