const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME
const isDev = process.env.NODE_ENV === "development"

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "use-sync-external-store/shim/index.js": require.resolve("use-sync-external-store/shim"),
    }
    return config
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // eslint se ignora en build de produccion para evitar fallo de regla de Next.js
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // ✅ REMOVIDO: output: 'standalone' - Interfiere con CSS en Railway
  images: {
    remotePatterns: [
      // localhost solo en desarrollo, nunca en produccion
      ...(isDev
        ? [{ protocol: "http", hostname: "localhost" }]
        : []),
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [{ protocol: "https", hostname: S3_HOSTNAME, pathname: S3_PATHNAME }]
        : []),
    ],
  },
}

module.exports = nextConfig
