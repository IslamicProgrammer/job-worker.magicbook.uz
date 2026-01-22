# Use Debian Bullseye for sharp compatibility
FROM node:20-bullseye-slim

# Install system dependencies for sharp
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libvips-dev \
    build-essential \
    python3 \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Force sharp to use its own prebuilt binaries
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

WORKDIR /app

# Copy package files only
COPY package*.json ./

# Install ALL dependencies including optional (sharp needs this)
RUN npm install --include=optional
RUN npm install --os=linux --cpu=x64 sharp
# Copy source code (node_modules excluded via .dockerignore)
COPY . .

# Build TypeScript
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/index.js"]
