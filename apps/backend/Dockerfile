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

CMD ["bun", "run", "start:dev"]
