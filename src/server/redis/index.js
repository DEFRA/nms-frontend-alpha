import {
  indexController,
  deleteController
} from '~/src/server/redis/controllers/index.js'
import { routePaths } from '../common/helpers/constants.js'

/**
 * Sets up the routes used in the redis page.
 * These routes are registered in src/server/router.js.
 */
const redis = {
  plugin: {
    name: 'redis',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: routePaths.redis,
          ...indexController
        },
        {
          method: 'GET',
          path: `${routePaths.redisDelete}/{id}`,
          ...deleteController
        }
      ])
    }
  }
}

export { redis }
