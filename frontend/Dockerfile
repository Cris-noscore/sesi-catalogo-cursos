# syntax=docker/dockerfile:1
# Build do front-end (Vite) servido por Nginx.
#   docker build -t catalogo-web --build-arg VITE_API_URL= ./frontend
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Vazio = mesma origem (o Nginx encaminha /api e /imagens para a API).
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
