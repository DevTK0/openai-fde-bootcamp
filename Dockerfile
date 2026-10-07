FROM node:24.21.0-bookworm-slim AS build

WORKDIR /app
RUN npm install --global pnpm@12.9.1
COPY . .
RUN pnpm install --frozen-lockfile && pnpm build

FROM node:24.21.0-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx \
    && rm -rf /var/lib/apt/lists/* /etc/nginx/sites-enabled/default \
    && npm install --global pnpm@12.9.1
WORKDIR /app
COPY --from=build /app /app
COPY deploy/nginx/coolify.conf /etc/nginx/conf.d/default.conf
COPY deploy/start-coolify.sh /usr/local/bin/start-coolify
RUN chmod +x /usr/local/bin/start-coolify \
    && nginx -t \
    && test -f /app/apps/slides/dist/index.html

EXPOSE 3000
CMD ["/usr/local/bin/start-coolify"]
