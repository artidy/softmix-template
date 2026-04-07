#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

print_success() {
    echo -e "${GREEN}✓ ${NC}$1"
}

print_error() {
    echo -e "${RED}✗ ${NC}$1"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${NC}$1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Banner
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     SoftMix E-Commerce Platform       ║${NC}"
echo -e "${BLUE}║          Start Script v1.0            ║${NC}"
echo -e "${BLUE}╔═══════════════════════════════════════╗${NC}"
echo ""

# Check if Node.js is installed
if ! command_exists node; then
    print_error "Node.js не установлен. Пожалуйста, установите Node.js 18.x или выше."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Требуется Node.js версии 18 или выше. Текущая версия: $(node -v)"
    exit 1
fi

print_success "Node.js версия: $(node -v)"

# Check if npm is installed
if ! command_exists npm; then
    print_error "npm не установлен."
    exit 1
fi

print_success "npm версия: $(npm -v)"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "Директория node_modules не найдена. Запускаем npm install..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Ошибка при установке зависимостей"
        exit 1
    fi
    print_success "Зависимости установлены"
fi

# Check if .env files exist
print_info "Проверка environment файлов..."
ENV_MISSING=0

if [ ! -f "environments/.users.env" ]; then
    print_warning "Файл environments/.users.env не найден"
    if [ -f "environments/.users.env.example" ]; then
        print_info "Копируем .users.env.example -> .users.env"
        cp environments/.users.env.example environments/.users.env
    else
        ENV_MISSING=1
    fi
fi

if [ ! -f "environments/.shop.env" ]; then
    print_warning "Файл environments/.shop.env не найден"
    if [ -f "environments/.shop.env.example" ]; then
        print_info "Копируем .shop.env.example -> .shop.env"
        cp environments/.shop.env.example environments/.shop.env
    else
        ENV_MISSING=1
    fi
fi

if [ ! -f "environments/.uploader.env" ]; then
    print_warning "Файл environments/.uploader.env не найден"
    if [ -f "environments/.uploader.env.example" ]; then
        print_info "Копируем .uploader.env.example -> .uploader.env"
        cp environments/.uploader.env.example environments/.uploader.env
    else
        ENV_MISSING=1
    fi
fi

if [ ! -f "environments/.bff.env" ]; then
    print_warning "Файл environments/.bff.env не найден"
    if [ -f "environments/.bff.env.example" ]; then
        print_info "Копируем .bff.env.example -> .bff.env"
        cp environments/.bff.env.example environments/.bff.env
    else
        ENV_MISSING=1
    fi
fi

if [ $ENV_MISSING -eq 1 ]; then
    print_error "Некоторые .env файлы отсутствуют. Создайте их на основе .env.example файлов."
    exit 1
fi

print_success "Environment файлы готовы"

# Ask user how to start the project
echo ""
print_info "Выберите способ запуска:"
echo "  1) Docker Compose (рекомендуется для production)"
echo "  2) Локальная разработка (все сервисы)"
echo "  3) Только backend сервисы (без frontend)"
echo "  4) Только микросервисы (без frontend и BFF)"
echo ""
read -p "Введите номер (1-4) [по умолчанию: 2]: " choice
choice=${choice:-2}

case $choice in
    1)
        print_info "Запуск через Docker Compose..."

        # Check if Docker is installed
        if ! command_exists docker; then
            print_error "Docker не установлен. Установите Docker Desktop."
            exit 1
        fi

        # Check if docker-compose is installed
        if ! command_exists docker-compose; then
            print_error "docker-compose не установлен."
            exit 1
        fi

        print_success "Docker версия: $(docker --version)"
        print_success "Docker Compose версия: $(docker-compose --version)"

        print_info "Запускаем контейнеры..."
        docker-compose up -d

        if [ $? -eq 0 ]; then
            print_success "Все сервисы запущены!"
            echo ""
            print_info "Сервисы доступны по адресам:"
            echo "  • Frontend:  http://localhost:4200"
            echo "  • BFF API:   http://localhost:5555"
            echo "  • Users:     http://localhost:3333"
            echo "  • Shop:      http://localhost:4444"
            echo "  • Uploader:  http://localhost:7777"
            echo ""
            print_info "Для просмотра логов: npm run docker:logs"
            print_info "Для остановки: npm run docker:down"
        else
            print_error "Ошибка при запуске Docker контейнеров"
            exit 1
        fi
        ;;
    2)
        print_info "Запуск всех сервисов локально..."
        print_warning "Убедитесь, что MongoDB и PostgreSQL запущены!"
        echo ""
        print_info "Запускаем: Frontend + Users + Shop + Uploader + BFF"
        npm run start:dev
        ;;
    3)
        print_info "Запуск только backend сервисов..."
        print_warning "Убедитесь, что MongoDB и PostgreSQL запущены!"
        echo ""
        print_info "Запускаем: Users + Shop + Uploader + BFF"
        npm run start:backend
        ;;
    4)
        print_info "Запуск только микросервисов..."
        print_warning "Убедитесь, что MongoDB и PostgreSQL запущены!"
        echo ""
        print_info "Запускаем: Users + Shop + Uploader"
        npm run start:services
        ;;
    *)
        print_error "Неверный выбор. Используйте 1-4."
        exit 1
        ;;
esac

echo ""
print_success "Готово!"
