import { routePaths } from '../../common/helpers/constants.js'
import { provideRedisKeys } from '../helpers/pre/index.js'

const indexController = {
  options: {
    pre: [provideRedisKeys]
  },
  handler: async (request, h) => {
    const keys = request.pre.keys
    return h.view('redis/index', {
      pageTitle: 'Redis Keys',
      heading: 'Redis Keys',
      keys: Object.keys(keys).length ? keys : null,
      deletePath: `${routePaths.redisDelete}`
    })
  }
}

export { indexController }
