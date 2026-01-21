# Use Debian-based Node for sharp compatibility
FROM node:20-bookworm-slim

# Install build tools and libvips for sharp
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies - sharp will compile from source
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3001

# Run the application
CMD ["node", "dist/index.js"]
