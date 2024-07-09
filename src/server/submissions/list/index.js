import { routePaths } from '../../common/helpers/constants.js'
import { indexController } from './controllers/index.js'

/**
 * Sets up the routes used in the list page.
 * These routes are registered in src/server/router.js.
 */

const list = {
  plugin: {
    name: 'list',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: routePaths.submission,
          ...indexController
        }
      ])
    }
  }
}

export { list }
