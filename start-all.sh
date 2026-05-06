#!/usr/bin/env bash
# ============================================
# King Keys - Start Full Stack Locally
# ============================================
# Linux / macOS / WSL script
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 King Keys - Starting local development stack..."
echo

# Check Docker
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed. Install Docker Desktop first: https://www.docker.com/products/docker-desktop"
  exit 1
fi

if ! docker info &> /dev/null; then
  echo "❌ Docker daemon is not running. Start Docker Desktop and retry."
  exit 1
fi

# Ensure backend .env exists
if [ ! -f "./backend/.env" ]; then
  echo "📄 backend/.env not found - creating from .env.example..."
  cp ./backend/.env.example ./backend/.env
  echo "⚠️  Edit backend/.env and set JWT_SECRET + COOKIE_SECRET before production!"
fi

# Ensure storefront .env.local exists
if [ ! -f "./king-keys-storefront/.env.local" ]; then
  echo "📄 king-keys-storefront/.env.local not found - creating from .env.local.example..."
  cp ./king-keys-storefront/.env.local.example ./king-keys-storefront/.env.local
fi

echo "🐳 Building and starting containers..."
docker compose up --build -d

echo
echo "⏳ Waiting for backend to be healthy..."
for i in {1..60}; do
  if curl -sf http://localhost:9000/health > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  sleep 2
  echo -n "."
done

echo
echo "=========================================="
echo "✅ King Keys stack is running!"
echo "=========================================="
echo "📦 Admin:      http://localhost:9000/app"
echo "🛍️  Storefront: http://localhost:8000"
echo "🗄️  MinIO:      http://localhost:9001 (minioadmin/minioadmin)"
echo
echo "📝 Next steps:"
echo "   1. Login to admin with credentials from backend/.env"
echo "   2. Settings → Publishable API Keys → create + copy"
echo "   3. Set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY in king-keys-storefront/.env.local"
echo "   4. Restart storefront: docker compose restart storefront"
echo
echo "📋 Useful commands:"
echo "   docker compose logs -f backend    # tail backend logs"
echo "   docker compose logs -f storefront # tail storefront logs"
echo "   docker compose down               # stop everything"
echo "=========================================="
