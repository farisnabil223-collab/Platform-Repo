FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY nx.json ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/
RUN npm ci
RUN npx nx run @eduverse/web:build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static
COPY --from=builder /app/apps/web/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
