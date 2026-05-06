#!/bin/bash

# Script para subir proyecto Medusa v2 con BTCPay a Git y Railway
# Uso: ./deploy.sh <git-repo-url>

if [ $# -eq 0 ]; then
    echo "❌ Error: Debes proporcionar la URL del repositorio Git"
    echo "Uso: ./deploy.sh https://github.com/tu-usuario/tu-repo.git"
    exit 1
fi

REPO_URL=$1

echo "🚀 Iniciando despliegue a Railway..."

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: No se encuentra docker-compose.yml. Asegúrate de estar en la raíz del proyecto."
    exit 1
fi

# Configurar repositorio remoto
echo "📡 Configurando repositorio remoto: $REPO_URL"
git remote add origin $REPO_URL 2>/dev/null || git remote set-url origin $REPO_URL

# Push a Git
echo "⬆️  Subiendo código a Git..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Código subido exitosamente a Git"
else
    echo "❌ Error al subir código a Git"
    exit 1
fi

echo ""
echo "🎉 ¡Proyecto listo para Railway!"
echo ""
echo "📋 Próximos pasos en Railway:"
echo "1. Ve a https://railway.app"
echo "2. Conecta tu repositorio Git: $REPO_URL"
echo "3. Railway detectará automáticamente la configuración"
echo "4. Configura estas variables de entorno:"
echo ""
echo "   # Base"
echo "   NODE_ENV=production"
echo "   PORT=9000"
echo ""
echo "   # Base de datos (Railway la crea automáticamente)"
echo "   DATABASE_URL=\${{ DATABASE_URL }}"
echo ""
echo "   # Redis (opcional, Railway lo crea automáticamente)"
echo "   REDIS_URL=\${{ REDIS_URL }}"
echo ""
echo "   # BTCPay"
echo "   BTCPAY_URL=https://tu-servidor-btcpay"
echo "   BTCPAY_API_KEY=tu_api_key_real"
echo "   BTCPAY_STORE_ID=tu_store_id_real"
echo ""
echo "   # URLs"
echo "   BACKEND_PUBLIC_URL=\${{ RAILWAY_STATIC_URL }}"
echo "   STORE_URL=https://tu-dominio-storefront"
echo ""
echo "   # Admin"
echo "   MEDUSA_ADMIN_EMAIL=tu-email@ejemplo.com"
echo "   MEDUSA_ADMIN_PASSWORD=tu_password_seguro"
echo ""
echo "5. Railway desplegará automáticamente backend y storefront"
echo "6. El webhook de BTCPay será: \${{ RAILWAY_STATIC_URL }}/api/btcpay/webhook"
echo ""
echo "🔗 URLs importantes:"
echo "- Admin Dashboard: \${{ RAILWAY_STATIC_URL }}/app"
echo "- Store API: \${{ RAILWAY_STATIC_URL }}/store"
echo "- Storefront: https://tu-dominio-storefront"