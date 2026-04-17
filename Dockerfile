FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./

FROM base AS deps
RUN npm install

FROM base AS builder
ARG NODE_ENV=production
ARG NEXT_PUBLIC_API_AUTH_SERVICE
ARG NEXT_PUBLIC_API_WAREHOUSE_SERVICE
ARG NEXT_PUBLIC_API_DEPO_SERVICE
ARG NEXT_PUBLIC_MAX_TOKEN_RETRY_ATTEMPTS=3

ENV NODE_ENV=${NODE_ENV} \
    NEXT_PUBLIC_API_AUTH_SERVICE=${NEXT_PUBLIC_API_AUTH_SERVICE} \
    NEXT_PUBLIC_API_WAREHOUSE_SERVICE=${NEXT_PUBLIC_API_WAREHOUSE_SERVICE} \
    NEXT_PUBLIC_API_DEPO_SERVICE=${NEXT_PUBLIC_API_DEPO_SERVICE} \
    NEXT_PUBLIC_MAX_TOKEN_RETRY_ATTEMPTS=${NEXT_PUBLIC_MAX_TOKEN_RETRY_ATTEMPTS}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache tini
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 \
    HOSTNAME="0.0.0.0"
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000 || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
