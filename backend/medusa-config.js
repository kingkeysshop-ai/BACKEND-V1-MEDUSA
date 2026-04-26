const { loadEnv, Modules, defineConfig } = require('@medusajs/framework/utils');

loadEnv(process.env.NODE_ENV, process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseLogging: false,
    redisUrl: process.env.REDIS_URL,
    workerMode: process.env.WORKER_MODE,
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
      options: {
        providers: [
          ...(process.env.MINIO_ENDPOINT && process.env.MINIO_ACCESS_KEY && process.env.MINIO_SECRET_KEY ? [{
            resolve: './src/modules/minio-file',
            id: 'minio',
            options: {
              endPoint: process.env.MINIO_ENDPOINT,
              accessKey: process.env.MINIO_ACCESS_KEY,
              secretKey: process.env.MINIO_SECRET_KEY,
              bucket: process.env.MINIO_BUCKET,
            }
          }] : [{
            resolve: '@medusajs/file-local',
            id: 'local',
            options: {
              upload_dir: 'static',
              backend_url: `${process.env.BACKEND_PUBLIC_URL}/static`,
            }
          }])
        ]
      }
    },
    {
      key: Modules.NOTIFICATION,
      resolve: '@medusajs/notification',
      options: {
        providers: [
          ...(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL ? [{
            resolve: './src/modules/resend',
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
          }] : [])
        ]
      }
    },
    {
      key: Modules.PAYMENT,
      resolve: '@medusajs/payment',
      options: {
        providers: [
          ...(process.env.STRIPE_API_KEY && process.env.STRIPE_WEBHOOK_SECRET ? [{
            resolve: '@medusajs/payment-stripe',
            id: 'stripe',
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            }
          }] : []),
          ...(process.env.AURPAY_API_KEY ? [{
            resolve: './src/modules/aurpay',
            id: 'aurpay',
            options: {
              api_key: process.env.AURPAY_API_KEY,
              environment: process.env.AURPAY_ENVIRONMENT || 'production',
            }
          }] : [])
        ]
      }
    },
    {
      key: Modules.SEARCH,
      resolve: '@medusajs/medusa/search',
      options: {
        providers: [
          ...(process.env.MEILISEARCH_HOST && process.env.MEILISEARCH_ADMIN_KEY ? [{
            resolve: '@rokmohar/medusa-plugin-meilisearch',
            id: 'meilisearch',
            options: {
              config: {
                host: process.env.MEILISEARCH_HOST,
                apiKey: process.env.MEILISEARCH_ADMIN_KEY,
              }
            }
          }] : [])
        ]
      }
    },
  ]
});