# Build context: sources/ (see docker/docker-compose.yml)
FROM node:24-alpine AS build
WORKDIR /app

COPY Web.App/package.json Web.App/package-lock.json ./
RUN npm ci

COPY Web.App/ .
# Bundle only; type checking (tsc -b in "npm run build") is left to local builds and CI.
RUN npx vite build

FROM nginx:alpine AS final

COPY Web.App/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
