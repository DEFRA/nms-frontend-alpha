import { routePaths } from '../../common/helpers/constants.js'
import {
  indexController,
  postController,
  validationController
} from './controllers/index.js'

/**
 * Sets up the routes used in the organization page.
 * These routes are registered in src/server/router.js.
 */
const organization = {
  plugin: {
    name: 'organization',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: `${routePaths.organization}/{id}`,
          ...indexController
        },
        {
          method: 'POST',
          path: `${routePaths.organization}/{id}`,
          ...postController,
          options: {
            validate: {
              ...validationController
            }
          }
        }
      ])
    }
  }
}

export { organization }
