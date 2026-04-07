# Используем базовый образ Nginx для целевой платформы amd64
FROM --platform=linux/amd64 nginx:alpine

# Копируем кастомную конфигурацию nginx
COPY ./apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /usr/share/nginx/html

# Копируем остальные файлы из ./dist/apps/frontend внутрь контейнера
COPY ./dist/apps/frontend .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
