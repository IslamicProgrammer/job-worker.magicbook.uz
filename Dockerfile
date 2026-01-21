# Use Debian-based Node for sharp compatibility
FROM node:20-bookworm

# Install libvips for sharp
RUN apt-get update && apt-get install -y \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Remove any cached sharp and reinstall fresh
RUN npm ci && npm rebuild sharp --verbose

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
