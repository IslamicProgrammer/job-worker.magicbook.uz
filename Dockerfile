# Use Debian-based Node (not Alpine) for sharp compatibility
FROM node:20-slim

# Install libvips runtime for sharp
RUN apt-get update && \
    apt-get install -y --no-install-recommends libvips42 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files only
COPY package*.json ./

# Install ALL dependencies including optional (sharp needs this)
RUN npm install --include=optional

# Copy source code (node_modules excluded via .dockerignore)
COPY . .

# Build TypeScript
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/index.js"]
