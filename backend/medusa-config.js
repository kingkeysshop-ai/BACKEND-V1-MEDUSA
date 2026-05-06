const { loadEnv, Modules, defineConfig } = require('@medusajs/framework/utils');

loadEnv(process.env.NODE_ENV, process.cwd());

// --- 1. CONFIGURACIÓN DE ARCHIVOS ---
const fileProviders = process.env.MINIO_ENDPOINT && process.env.MINIO_ACCESS_KEY && process.env.MINIO_SECRET_KEY
  ? [{
      resolve: './src/modules/minio-file',
      id: 'minio',
      options: {
        endPoint: process.env.MINIO_ENDPOINT,
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
        bucket: process.env.MINIO_BUCKET,
      }
    }]
  : [{
      resolve: '@medusajs/file-local',
      id: 'local',
      options: {
        upload_dir: 'static',
        backend_url: `${process.env.BACKEND_PUBLIC_URL}/static`,
      }
    }];

// --- 2. CONFIGURACIÓN DE NOTIFICACIONES ---
const notificationProviders = [
  ...(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL ? [{
    resolve: './src/modules/email-notifications',
    id: 'resend',
    options: {
      channels: ['email'],
      api_key: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM_EMAIL,
    }
  }] : []),
  ...(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL ? [{
    resolve: '@medusajs/notification-sendgrid',
    id: 'sendgrid',
    options: {
      channels: ['email'],
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM_EMAIL,
    }
  }] : []),
];

// --- 3. MÓDULOS OPCIONALES (NOTIFICACIONES) ---
// Nota: El módulo de pagos (BTCPay) se carga directamente, no necesita un provider wrapper aquí
const optionalModules = [
  ...(notificationProviders.length > 0 ? [{
    key: Modules.NOTIFICATION,
    resolve: '@medusajs/notification',
    options: { providers: notificationProviders }
  }] : []),
];

// --- 4. CONFIGURACIÓN PRINCIPAL ---
module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseLogging: false,
    redisUrl: process.env.REDIS_URL,
    workerMode: process.env.WORKER_MODE ?? 'shared',
    http: {
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      storeCors: process.env.STORE_CORS,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  admin: {
    backendUrl: process.env.BACKEND_PUBLIC_URL,
    disable: process.env.SHOULD_DISABLE_ADMIN === 'true',
  },
  modules: [
    {
      key: Modules.FILE,
      resolve: '@medusajs/file',
      options: { providers: fileProviders }
    },
    // ✅ MÓDULO DE LICENCIAS (Corregido)
    {
      key: 'license_manager',
      resolve: './src/modules/license-manager',
    },
    // ✅ MÓDULO BTCPAY (NUEVO - Pagos en Cripto)
    {
      resolve: './src/modules/btcpay-payment',
      id: 'btcpay-payment',
      options: {}
    },
    // --- Redis & Workflow Engine (Opcional) ---
    ...(process.env.REDIS_URL ? [
      {
        key: Modules.EVENT_BUS,
        resolve: '@medusajs/event-bus-redis',
        options: {
          redisUrl: process.env.REDIS_URL,
        }
      },
      {
        key: Modules.WORKFLOW_ENGINE,
        resolve: '@medusajs/workflow-engine-redis',
        options: {
          redis: {
            url: process.env.REDIS_URL,
          }
        }
      }
    ] : []),
    // --- Notificaciones (Si están configuradas) ---
    ...optionalModules,
  ],
  plugins: [] // Dejar vacío, los módulos se cargan arriba
});