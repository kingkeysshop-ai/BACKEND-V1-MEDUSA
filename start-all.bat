@echo off
REM ============================================
REM King Keys - Start Full Stack Locally (Windows)
REM ============================================
setlocal EnableDelayedExpansion

cd /d "%~dp0"

echo.
echo ==========================================
echo King Keys - Starting local dev stack...
echo ==========================================
echo.

REM Check Docker
where docker >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Docker is not installed. Install Docker Desktop: https://www.docker.com/products/docker-desktop
  exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Docker daemon is not running. Start Docker Desktop and retry.
  exit /b 1
)

REM Ensure backend .env
if not exist "backend\.env" (
  echo Creating backend\.env from .env.example...
  copy /Y "backend\.env.example" "backend\.env" >nul
  echo [WARN] Edit backend\.env and set JWT_SECRET + COOKIE_SECRET for production!
)

REM Ensure storefront .env.local
if not exist "king-keys-storefront\.env.local" (
  echo Creating king-keys-storefront\.env.local from .env.local.example...
  copy /Y "king-keys-storefront\.env.local.example" "king-keys-storefront\.env.local" >nul
)

echo.
echo Building and starting containers...
docker compose up --build -d
if errorlevel 1 (
  echo [ERROR] docker compose failed
  exit /b 1
)

echo.
echo Waiting for backend to be healthy...
set /a tries=0
:waitloop
set /a tries+=1
if !tries! GTR 60 goto :done
curl -sf http://localhost:9000/health >nul 2>&1
if errorlevel 1 (
  timeout /t 2 /nobreak >nul
  <nul set /p=.
  goto :waitloop
)
echo.
echo [OK] Backend is ready!

:done
echo.
echo ==========================================
echo   King Keys stack is running!
echo ==========================================
echo   Admin:      http://localhost:9000/app
echo   Storefront: http://localhost:8000
echo   MinIO:      http://localhost:9001  (minioadmin / minioadmin)
echo.
echo Next steps:
echo   1. Login to admin with credentials from backend\.env
echo   2. Settings -^> Publishable API Keys -^> create + copy
echo   3. Set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY in king-keys-storefront\.env.local
echo   4. Restart storefront:  docker compose restart storefront
echo.
echo Useful:
echo   docker compose logs -f backend
echo   docker compose logs -f storefront
echo   docker compose down
echo ==========================================

endlocal
