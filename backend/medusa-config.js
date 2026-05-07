const backendUrl = process.env.BACKEND_PUBLIC_URL || 'http://localhost:9000';

const plugins = [
  {
    resolve: '@medusajs/file-local',
    options: {
      upload_dir: 'static',
      backend_url: `${backendUrl}/static`,
    },
  },
  ...(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL ? [{
    resolve: '@medusajs/notification-sendgrid',
    options: {
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM_EMAIL,
    },
  }] : []),
  ...(process.env.STRIPE_API_KEY ? [{
    resolve: '@medusajs/payment-stripe',
    options: {
      api_key: process.env.STRIPE_API_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  }] : []),
  ...(process.env.REDIS_URL ? [
    {
      resolve: '@medusajs/event-bus-redis',
      options: {
        redis_url: process.env.REDIS_URL,
      },
    },
    {
      resolve: '@medusajs/workflow-engine-redis',
      options: {
        redis_url: process.env.REDIS_URL,
      },
    },
  ] : []),
];

module.exports = {
  projectConfig: {
    database_url: process.env.DATABASE_URL,
    database_type: 'postgres',
    store_cors: process.env.STORE_CORS,
    admin_cors: process.env.ADMIN_CORS,
    auth_cors: process.env.AUTH_CORS,
    jwt_secret: process.env.JWT_SECRET,
    cookie_secret: process.env.COOKIE_SECRET,
    redis_url: process.env.REDIS_URL,
  },
  plugins,
};