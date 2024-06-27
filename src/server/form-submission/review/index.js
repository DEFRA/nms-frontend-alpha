import { routePaths } from '../../common/helpers/constants.js'
import { indexController } from './controllers/index-controller.js'

/**
 * Sets up the routes used in the review page.
 * These routes are registered in src/server/router.js.
 */
const review = {
  plugin: {
    name: 'review',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: `${routePaths.review}/{id}`,
          ...indexController
        }
      ])
    }
  }
}

export { review }
