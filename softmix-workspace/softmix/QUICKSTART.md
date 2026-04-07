# 🚀 Quick Start Guide

Быстрое руководство по запуску проекта SoftMix за 3 шага.

## Шаг 1: Установка

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd softmix-workspace/softmix

# Установите зависимости
npm install
```

## Шаг 2: Настройка

Environment файлы будут созданы автоматически при первом запуске из `.env.example` файлов.

Для ручной настройки:

```bash
cd environments
cp .users.env.example .users.env
cp .shop.env.example .shop.env
cp .uploader.env.example .uploader.env
cp .bff.env.example .bff.env
```

## Шаг 3: Запуск

### Вариант А: Автоматический запуск (рекомендуется)

```bash
npm start
```

Выберите один из вариантов в интерактивном меню:
1. **Docker Compose** - запуск в контейнерах (не требует локальных БД)
2. **Локальная разработка** - все сервисы локально
3. **Только backend** - микросервисы + BFF
4. **Только микросервисы** - Users + Shop + Uploader

### Вариант Б: Docker (самый простой)

```bash
npm run docker:up
```

### Вариант В: Локальная разработка

```bash
# Убедитесь, что MongoDB и PostgreSQL запущены локально!
npm run start:dev
```

## Готово! 🎉

Сервисы доступны по адресам:

- **Frontend**: http://localhost:4200
- **BFF API**: http://localhost:5555/spec (Swagger)
- **Users API**: http://localhost:3333/spec
- **Shop API**: http://localhost:4444/spec
- **Uploader API**: http://localhost:7777/spec

## Полезные команды

```bash
# Просмотр логов (Docker)
npm run docker:logs

# Остановка (Docker)
npm run docker:down

# Запуск тестов
npm run test:all

# Lint проверка
npm run lint:all

# Форматирование кода
npm run format
```

## Возникли проблемы?

### MongoDB/PostgreSQL не запущены

Если вы используете локальный запуск (не Docker), убедитесь что:

```bash
# MongoDB запущен
brew services start mongodb-community
# или
docker run -d -p 27017:27017 mongo:7

# PostgreSQL запущен
brew services start postgresql
# или
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=test postgres:16-alpine
```

### Порты заняты

Проверьте, что порты 3333, 4200, 4444, 5555, 7777 свободны:

```bash
lsof -i :4200  # Проверка порта
kill -9 <PID>  # Освобождение порта
```

### Нужна помощь?

Смотрите полную документацию в [README.md](README.md)
