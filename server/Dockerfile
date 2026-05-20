FROM node:18-alpine AS builder

WORKDIR /app

# Install dev dependencies and build
COPY package.json package-lock.json ./
RUN npm ci --silent

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

FROM node:18-alpine
WORKDIR /app

# Install only production deps
COPY package.json package-lock.json ./
RUN npm ci --only=production --silent

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

CMD ["node", "dist/index.js"]
