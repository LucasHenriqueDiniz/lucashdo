# syntax=docker/dockerfile:1

# ---- Base Node ----
FROM node:20-slim AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ---- Dependencies ----
FROM base AS deps
# Install build essentials for native modules and Python for node-gyp
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and related files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (pnpm is faster and more efficient than npm)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# ---- Builder ----
FROM base AS builder
# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy project files
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Enable standalone output mode in Next.js
ENV NEXT_OUTPUT_STANDALONE=true

# Build the application with increased memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm run build

# ---- Production ----
FROM node:20-slim AS runner
WORKDIR /app

# Install native dependencies required for runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy necessary files from the builder stage
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/next-intl.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
