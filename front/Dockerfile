FROM node:20-alpine AS builder
WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY package*.json ./
RUN npm ci

# Копируем исходный код и собираем
COPY . .
RUN npm run build

FROM nginx:alpine AS runtime
WORKDIR /usr/share/nginx/html

# Копируем собранное приложение
COPY --from=builder /app/dist .

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80