# Multi-stage Dockerfile for Medusa 2.0
# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files + .env.template first
COPY package.json pnpm-lock.yaml .npmrc ./
COPY .env.template .env

# Install deps
RUN corepack enable && pnpm ci --frozen-lockfile

# Copy source code
COPY . .

# Build the application (this will now have .env + all source files)
RUN pnpm run build

# Stage 2: Runtime
FROM node:22-alpine AS runtime

WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/.medusa/server ./server
COPY --from=builder /app/.medusa/types ./server/types
COPY --from=builder /app/server/package.json ./server/

# Copy .env for runtime
COPY --from=builder /app/.env ./

# Install only production deps in server
RUN corepack enable && \
    cd server && \
    pnpm ci --prod --frozen-lockfile && \
    cd .. && \
    rm -rf server/node_modules/.cache

# Expose port
EXPOSE 9000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:9000/health || exit 1

# Start server
CMD ["node", "server/index.js"]
