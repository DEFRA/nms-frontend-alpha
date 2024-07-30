import convict from 'convict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const oneHour = 1000 * 60 * 60
const fourHours = oneHour * 4
const oneWeekMillis = oneHour * 24 * 7

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  staticCacheTimeout: {
    doc: 'Static cache timeout in milliseconds',
    format: Number,
    default: oneWeekMillis,
    env: 'STATIC_CACHE_TIMEOUT'
  },
  serviceName: {
    doc: 'Applications Service Name',
    format: String,
    default: 'nms-frontend-alpha'
  },
  root: {
    doc: 'Project root',
    format: String,
    default: path.resolve(dirname, '../..')
  },
  assetPath: {
    doc: 'Asset path',
    format: String,
    default: '/public',
    env: 'ASSET_PATH'
  },
  isProduction: {
    doc: 'If this application running in the production environment',
    format: Boolean,
    default: process.env.NODE_ENV === 'production'
  },
  isDevelopment: {
    doc: 'If this application running in the development environment',
    format: Boolean,
    default: process.env.NODE_ENV !== 'production'
  },
  isTest: {
    doc: 'If this application running in the test environment',
    format: Boolean,
    default: process.env.NODE_ENV === 'test'
  },
  logLevel: {
    doc: 'Logging level',
    format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
    default: 'info',
    env: 'LOG_LEVEL'
  },
  httpProxy: {
    doc: 'HTTP Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'CDP_HTTP_PROXY'
  },
  httpsProxy: {
    doc: 'HTTPS Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'CDP_HTTPS_PROXY'
  },
  session: {
    cache: {
      name: {
        doc: 'server side session cache name',
        format: String,
        default: 'nmsFrontendSession',
        env: 'SESSION_CACHE_NAME'
      },
      ttl: {
        doc: 'server side session cache ttl',
        format: Number,
        default: fourHours,
        env: 'SESSION_CACHE_TTL'
      }
    },
    cookie: {
      ttl: {
        doc: 'Session cookie ttl',
        format: Number,
        default: fourHours,
        env: 'SESSION_COOKIE_TTL'
      },
      password: {
        doc: 'session cookie password',
        format: String,
        default: 'GApeeVRxTf$unUEAjAue*%RFqtuDhBdM',
        env: 'SESSION_COOKIE_PASSWORD',
        sensitive: true
      }
    }
  },
  redis: {
    enabled: {
      doc: 'Enable Redis on your Frontend. Before you enable Redis, contact the CDP platform team as we need to set up config so you can run Redis in CDP environments',
      format: Boolean,
      default: true,
      env: 'REDIS_ENABLED'
    },
    host: {
      doc: 'Redis cache host',
      format: String,
      default: '192.168.125.138',
      env: 'REDIS_HOST'
    },
    username: {
      doc: 'Redis cache username',
      format: String,
      default: '',
      env: 'REDIS_USERNAME'
    },
    password: {
      doc: 'Redis cache password',
      format: '*',
      default: '',
      sensitive: true,
      env: 'REDIS_PASSWORD'
    },
    keyPrefix: {
      doc: 'Redis cache key prefix name used to isolate the cached results across multiple clients',
      format: String,
      default: 'nms:',
      env: 'REDIS_KEY_PREFIX'
    },
    useSingleInstanceCache: {
      doc: 'Enable the use of a single instance Redis Cache',
      format: Boolean,
      default: process.env.NODE_ENV !== 'production',
      env: 'USE_SINGLE_INSTANCE_CACHE'
    }
  },
  nms: {
    apiPath: {
      doc: 'NMS Backend REST API path',
      format: String,
      default: 'http://localhost:3001/', // 'https://nms-backend-alpha.dev.cdp-int.defra.cloud/'
      env: 'NMS_BE_API'
    }
  },
  awsRegion: {
    doc: 'AWS region',
    format: String,
    default: 'eu-west-2',
    env: 'AWS_REGION'
  },
  localstackEndpoint: {
    doc: 'Localstack endpoint',
    format: String,
    default: 'http://localhost:4566'
  },
  bucket: {
    doc: 'Bucket name',
    format: String,
    default: 'nms-local-frontend',
    env: 'BUCKET'
  },
  cdpUploaderUrl: {
    doc: 'CDP Uploader root url',
    format: String,
    default: 'http://localhost:7337',
    env: 'CDP_UPLOADER_URL'
  },
  defraCustomer: {
    dcClientId: {
      doc: 'The DEFRA Customer client ID',
      format: String,
      required: true,
      default: null,
      env: 'DC_CLIENT_ID',
      sensitive: true
    },
    dcServiceId: {
      doc: 'The DEFRA Customer service ID',
      format: String,
      required: true,
      default: null,
      env: 'DC_SERVICE_ID',
      sensitive: true
    },
    dcRedirectUrl: {
      doc: 'The DEFRA Customer redirect URL',
      format: String,
      default: 'http://localhost:3000/auth-callback',
      env: 'DC_REDIRECT_URL'
    },
    dcTenantName: {
      doc: 'The DEFRA Customer tenant name',
      format: String,
      default: 'dcidmtest',
      env: 'DC_TENANT_NAME'
    },
    dcPolicyName: {
      doc: 'The DEFRA Customer policy name',
      format: String,
      default: 'b2c_1a_cui_cpdev_signupsignin',
      env: 'DC_POLICY_NAME'
    }
  }
})

config.validate({ allowed: 'strict' })

export { config }
