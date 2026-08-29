FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY nx.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
RUN npm ci
RUN npx nx run @eduverse/api:build --configuration=production

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=builder /app/apps/api/dist ./dist
EXPOSE 4000
CMD ["node", "dist/main.js"]
