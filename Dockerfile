FROM node:20-slim AS builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM node:20-slim
WORKDIR /app
# Backend deps
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ .
# Copy built frontend
COPY --from=builder /app/frontend/dist ./public

EXPOSE 3000
CMD ["node", "app.js"]