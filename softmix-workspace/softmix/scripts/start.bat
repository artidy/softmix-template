@echo off
SETLOCAL EnableDelayedExpansion

:: Colors (using Windows 10+ ANSI escape codes)
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RED=[91m"
set "NC=[0m"

:: Banner
echo.
echo %BLUE%╔═══════════════════════════════════════╗%NC%
echo %BLUE%║     SoftMix E-Commerce Platform       ║%NC%
echo %BLUE%║          Start Script v1.0            ║%NC%
echo %BLUE%╚═══════════════════════════════════════╝%NC%
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%✗ Node.js не установлен. Пожалуйста, установите Node.js 18.x или выше.%NC%
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo %GREEN%✓ Node.js версия: %NODE_VERSION%%NC%

:: Check if npm is installed
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%✗ npm не установлен.%NC%
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo %GREEN%✓ npm версия: %NPM_VERSION%%NC%

:: Check if node_modules exists
if not exist "node_modules\" (
    echo %YELLOW%⚠ Директория node_modules не найдена. Запускаем npm install...%NC%
    call npm install
    if %errorlevel% neq 0 (
        echo %RED%✗ Ошибка при установке зависимостей%NC%
        exit /b 1
    )
    echo %GREEN%✓ Зависимости установлены%NC%
)

:: Check if .env files exist
echo %BLUE%ℹ Проверка environment файлов...%NC%

if not exist "environments\.users.env" (
    if exist "environments\.users.env.example" (
        echo %BLUE%ℹ Копируем .users.env.example -^> .users.env%NC%
        copy "environments\.users.env.example" "environments\.users.env" >nul
    )
)

if not exist "environments\.shop.env" (
    if exist "environments\.shop.env.example" (
        echo %BLUE%ℹ Копируем .shop.env.example -^> .shop.env%NC%
        copy "environments\.shop.env.example" "environments\.shop.env" >nul
    )
)

if not exist "environments\.uploader.env" (
    if exist "environments\.uploader.env.example" (
        echo %BLUE%ℹ Копируем .uploader.env.example -^> .uploader.env%NC%
        copy "environments\.uploader.env.example" "environments\.uploader.env" >nul
    )
)

if not exist "environments\.bff.env" (
    if exist "environments\.bff.env.example" (
        echo %BLUE%ℹ Копируем .bff.env.example -^> .bff.env%NC%
        copy "environments\.bff.env.example" "environments\.bff.env" >nul
    )
)

echo %GREEN%✓ Environment файлы готовы%NC%

:: Ask user how to start
echo.
echo %BLUE%ℹ Выберите способ запуска:%NC%
echo   1^) Docker Compose (рекомендуется для production^)
echo   2^) Локальная разработка (все сервисы^)
echo   3^) Только backend сервисы (без frontend^)
echo   4^) Только микросервисы (без frontend и BFF^)
echo.
set /p choice="Введите номер (1-4) [по умолчанию: 2]: "
if "%choice%"=="" set choice=2

if "%choice%"=="1" (
    echo %BLUE%ℹ Запуск через Docker Compose...%NC%

    where docker >nul 2>&1
    if %errorlevel% neq 0 (
        echo %RED%✗ Docker не установлен.%NC%
        exit /b 1
    )

    where docker-compose >nul 2>&1
    if %errorlevel% neq 0 (
        echo %RED%✗ docker-compose не установлен.%NC%
        exit /b 1
    )

    echo %BLUE%ℹ Запускаем контейнеры...%NC%
    docker-compose up -d

    if %errorlevel% equ 0 (
        echo.
        echo %GREEN%✓ Все сервисы запущены!%NC%
        echo.
        echo %BLUE%ℹ Сервисы доступны по адресам:%NC%
        echo   • Frontend:  http://localhost:4200
        echo   • BFF API:   http://localhost:5555
        echo   • Users:     http://localhost:3333
        echo   • Shop:      http://localhost:4444
        echo   • Uploader:  http://localhost:7777
        echo.
        echo %BLUE%ℹ Для просмотра логов: npm run docker:logs%NC%
        echo %BLUE%ℹ Для остановки: npm run docker:down%NC%
    ) else (
        echo %RED%✗ Ошибка при запуске Docker контейнеров%NC%
        exit /b 1
    )
) else if "%choice%"=="2" (
    echo %BLUE%ℹ Запуск всех сервисов локально...%NC%
    echo %YELLOW%⚠ Убедитесь, что MongoDB и PostgreSQL запущены!%NC%
    echo.
    echo %BLUE%ℹ Запускаем: Frontend + Users + Shop + Uploader + BFF%NC%
    call npm run start:dev
) else if "%choice%"=="3" (
    echo %BLUE%ℹ Запуск только backend сервисов...%NC%
    echo %YELLOW%⚠ Убедитесь, что MongoDB и PostgreSQL запущены!%NC%
    echo.
    echo %BLUE%ℹ Запускаем: Users + Shop + Uploader + BFF%NC%
    call npm run start:backend
) else if "%choice%"=="4" (
    echo %BLUE%ℹ Запуск только микросервисов...%NC%
    echo %YELLOW%⚠ Убедитесь, что MongoDB и PostgreSQL запущены!%NC%
    echo.
    echo %BLUE%ℹ Запускаем: Users + Shop + Uploader%NC%
    call npm run start:services
) else (
    echo %RED%✗ Неверный выбор. Используйте 1-4.%NC%
    exit /b 1
)

echo.
echo %GREEN%✓ Готово!%NC%
