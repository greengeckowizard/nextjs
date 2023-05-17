# Get deps
FROM --platform=linux/arm64 node:16-alpine AS deps
WORKDIR /deps
COPY package.json yarn.lock ./
RUN yarn config set registry https://registry.npmjs.org/
RUN yarn config set network-timeout 1200000
RUN yarn install --frozen-lockfile

# Build the Next.js app
FROM --platform=linux/arm64 node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /deps/node_modules /app/node_modules
COPY . .
RUN yarn build

# Run the Next.js app
FROM --platform=linux/arm64 node:16-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/public /app/public
EXPOSE 3000
CMD ["yarn", "start"]
