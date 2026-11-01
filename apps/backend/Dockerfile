FROM oven/bun:1

WORKDIR /app

# Copy root monorepo manifest and package manifests
COPY package.json ./
COPY apps/backend ./apps/backend

# Install dependencies using Bun
RUN bun install

WORKDIR /app/apps/backend

# The Prisma client is generated from the schema and is required at runtime.
RUN bun run prisma:generate

EXPOSE 4000

ENV NODE_ENV=development \
    PORT_BACKEND=4000

# Local Compose has no committed Prisma migrations yet. Apply the schema after
# PostgreSQL is healthy so uploaded documents are persisted before Nest starts.
CMD ["sh", "-c", "bun run prisma:push && bun run start:dev"]
