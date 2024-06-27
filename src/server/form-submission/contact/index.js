import { routePaths } from '../../common/helpers/constants.js'
import {
  indexController,
  postController,
  validationController
} from './controllers/index.js'

/**
 * Sets up the routes used in the contact page.
 * These routes are registered in src/server/router.js.
 */
const contact = {
  plugin: {
    name: 'contact',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: `${routePaths.contact}/{id?}`,
          ...indexController
        },
        {
          method: 'POST',
          path: routePaths.contact,
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

export { contact }
