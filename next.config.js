/** @type {import('next').NextConfig} */

const { getAbsPath } = require('./scripts/fileSystem')

const appEnv = process.env.STORE_CMS_ENV

if (!appEnv) {
  console.error('STORE_CMS_ENV env variable is not set', process.env.HSCI_STORE_CMS_ENV)
  process.exit(1)
}

const { parsed: parsedEnvs } = require('dotenv').config({
  path: getAbsPath(`env/${appEnv}.env`),
})

const nextConfig = {
  env: {
    ...parsedEnvs,
    STORE_CMS_ENV: process.env.STORE_CMS_ENV,
  },
  trailingSlash: false,
  basePath: '',
  poweredByHeader: false,
  optimizeFonts: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  async redirects() {
    return []
  },
}

module.exports = nextConfig
