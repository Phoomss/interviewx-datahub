FROM oven/bun:1

WORKDIR /app

# Copy root monorepo manifest and package manifests
COPY package.json ./
COPY apps/frontend ./apps/frontend

# Install dependencies using Bun
RUN bun install

WORKDIR /app/apps/frontend

EXPOSE 3000

ENV NODE_ENV=development \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

CMD ["bun", "run", "dev"]
