# Use Debian Bullseye for sharp compatibility
FROM node:20-bullseye-slim

# System dependencies for sharp + Infisical CLI install.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libvips-dev \
    build-essential \
    python3 \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ponytail: CLI installed in-image (not host bind-mount) because Dokploy builds pure Dockerfiles.
RUN curl -1sLf 'https://artifacts-cli.infisical.com/setup.deb.sh' | bash \
    && apt-get update && apt-get install -y infisical \
    && rm -rf /var/lib/apt/lists/*

# Force sharp to use its own prebuilt binaries
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

WORKDIR /app

# Copy package files and prisma schema (needed for postinstall prisma generate)
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies including optional (sharp needs this)
RUN npm install --include=optional
RUN npm install --os=linux --cpu=x64 sharp
# Copy source code (node_modules excluded via .dockerignore)
COPY . .

# Build TypeScript
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3001

# strip CRLF in case the file was checked out on Windows, then run via Infisical.
RUN sed -i 's/\r$//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh
ENTRYPOINT ["/app/docker-entrypoint.sh"]
