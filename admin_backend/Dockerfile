FROM node:18-alpine AS builder

WORKDIR /app

# Copy root workspace files
COPY package.json yarn.lock ./
COPY admin_backend/package.json ./admin_backend/
COPY shared/package.json ./shared/

# Install dependencies
RUN yarn install

# Copy source code
COPY admin_backend ./admin_backend
COPY shared ./shared

# Build the application
WORKDIR /app/admin_backend
RUN yarn build

FROM node:18-alpine AS production

WORKDIR /app

# Copy workspace files for production
COPY package.json yarn.lock ./
COPY admin_backend/package.json ./admin_backend/
COPY shared/package.json ./shared/

# Install production dependencies
RUN yarn install --production

# Copy built files
COPY --from=builder /app/admin_backend/dist ./admin_backend/dist
COPY --from=builder /app/shared ./shared

USER node

CMD ["node", "admin_backend/dist/src/index.js"]