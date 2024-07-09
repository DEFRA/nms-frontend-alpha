import { config } from '~/src/config/index.js'

const redisConfig = config.get('redis')
const keyPrefix = redisConfig.keyPrefix

const provideRedisKeys = {
  method: async (request, h) => {
    try {
      const keys = await request.redis.getAll()
      const resultKeys = {}
      if (keys.length > 0) {
        keys.forEach((value, index) => {
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              resultKeys[index] = item?.replace(keyPrefix, '')
            })
          } else {
            resultKeys[index] = value?.replace(keyPrefix, '')
          }
        })
      }
      return resultKeys
    } catch (error) {
      request.logger.info(`Error fetching redis keys: ${error}`)
      throw error
    }
  },
  assign: 'keys'
}

export { provideRedisKeys }
