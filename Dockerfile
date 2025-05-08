FROM node:22-slim AS builder
WORKDIR /app/frontend
# Frontend deps
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM node:22-slim
WORKDIR /app
# Backend deps
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ .
# Copy built frontend
COPY --from=builder /app/frontend/dist ./public

ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE ${PORT}
CMD ["node", "app.js"]