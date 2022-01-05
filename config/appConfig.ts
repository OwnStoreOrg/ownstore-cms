const app = {
  name: 'OwnStore Demo - CMS',
  key: 'OWN-STORE-DEMO-CMS', // should be uppercase
}

const appConfig = {
  isDev: process.env.STORE_CMS_ENV.includes('local'),
  env: process.env.STORE_CMS_ENV,
  global: {
    app: app,
    domain: process.env.STORE_CMS_DOMAIN,
    baseUrl: process.env.STORE_CMS_BASE_URL,
    imageBaseUrl: process.env.STORE_CMS_IMAGE_BASE_URL,
    apiBaseUrl: process.env.STORE_CMS_API_BASE_URL,
    webBaseUrl: process.env.STORE_CMS_WEB_BASE_URL,
    redirectToIndexViewAfterUpdate: true,
    redirectToIndexViewAfterDelete: true,
    paginationFetchLimit: 20,
  },
  order: {
    recentOrders: {
      autoRefresh: true,
      refreshIntervalInSeconds: 30,
    },
  },
  search: {
    limit: 30,
  },
  image: {
    imageUploadDirectory: {
      PRODUCT: 'product',
      CATALOGUE: 'catalogue',
      BLOG: 'blog',
      SECTION: 'section',
      MISC: 'misc',
      NONE: 'none',
    },
  },
  integrations: {
    cloudinary: {
      cloudName: process.env.STORE_CMS_INTEGRATION_CLOUDINARY_CLOUND_NAME,
      uploadPresetName: process.env.STORE_CMS_INTEGRATION_CLOUDINARY_UPLOAD_PRESET_NAME,
    },
    googleAnalytics: {
      enabled: process.env.STORE_CMS_INTEGRATION_GOOGLE_ANALYTICS_ENABLED === 'true',
      code: process.env.STORE_CMS_INTEGRATION_GOOGLE_ANALYTICS_CODE,
    },
  },
}

export default appConfig
