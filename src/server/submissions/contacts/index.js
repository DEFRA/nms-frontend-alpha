import { routePaths } from '../../common/helpers/constants.js'
import { indexController, submitController } from './controllers/index.js'

/**
 * Sets up the routes used in the contact page.
 * These routes are registered in src/server/router.js.
 */

const contacts = {
  plugin: {
    name: 'contact',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: `${routePaths.contact}/{id}/{cid?}`,
          ...indexController
        },
        {
          method: 'POST',
          path: `${routePaths.contact}/{id}/{cid?}`,
          ...submitController
        }
      ])
    }
  }
}

export { contacts }
