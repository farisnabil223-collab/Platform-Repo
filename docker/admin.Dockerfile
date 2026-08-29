FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY nx.json ./
COPY packages/ ./packages/
COPY apps/admin/ ./apps/admin/
RUN npm ci
RUN npx nx run @eduverse/admin:build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=builder /app/apps/admin/.next/standalone ./
COPY --from=builder /app/apps/admin/.next/static ./.next/static
COPY --from=builder /app/apps/admin/public ./public
EXPOSE 3001
CMD ["node", "server.js"]
