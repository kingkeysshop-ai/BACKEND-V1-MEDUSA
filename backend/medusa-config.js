const { loadEnv, Modules, defineConfig } = require('@medusajs/framework/utils');

loadEnv(process.env.NODE_ENV, process.cwd());

// Construir providers condicionalmente para evitar arrays vacíos
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

const paymentProviders = [
  ...(process.env.STRIPE_API_KEY && process.env.STRIPE_WEBHOOK_SECRET ? [{
    resolve: '@medusajs/payment-stripe',
    id: 'stripe',
    options: {
      apiKey: process.env.STRIPE_API_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    }
  }] : []),
  ...(process.env.AURPAY_API_TOKEN && process.env.AURPAY_API_SECRET ? [{
    resolve: './src/modules/aurpay',
    id: 'aurpay',
    options: {
      apiToken: process.env.AURPAY_API_TOKEN,
      apiSecret: process.env.AURPAY_API_SECRET,
      callbackToken: process.env.AURPAY_CALLBACK_TOKEN || '',
      callbackSecret: process.env.AURPAY_CALLBACK_SECRET || '',
    }
  }] : []),
  ...(process.env.AUTHORIZE_NET_LOGIN_ID && process.env.AUTHORIZE_NET_TRANSACTION_KEY ? [{
    resolve: './src/modules/authorize-net',
    id: 'authorizenet',
    options: {
      login_id: process.env.AUTHORIZE_NET_LOGIN_ID,
      transaction_key: process.env.AUTHORIZE_NET_TRANSACTION_KEY,
      public_client_key: process.env.AUTHORIZE_NET_PUBLIC_CLIENT_KEY || '',
      environment: process.env.AUTHORIZE_NET_ENVIRONMENT || 'sandbox',
      webhook_secret: process.env.AUTHORIZE_NET_WEBHOOK_SECRET || '',
    }
  }] : []),
];

// Módulos opcionales (solo se incluyen si están configurados)
const optionalModules = [
  ...(notificationProviders.length > 0 ? [{
    key: Modules.NOTIFICATION,
    resolve: '@medusajs/notification',
    options: { providers: notificationProviders }
  }] : []),
  ...(paymentProviders.length > 0 ? [{
    key: Modules.PAYMENT,
    resolve: '@medusajs/payment',
    options: { providers: paymentProviders }
  }] : []),
  // ⚠️ Modules.SEARCH eliminado — no existe en Medusa 2.x como módulo core
];

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
       {
      resolve: "./src/modules/license-manager",
    },
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
    ...optionalModules,
  ],
  plugins: []
});