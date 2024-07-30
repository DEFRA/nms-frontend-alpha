import { routePaths } from '../common/helpers/constants.js'
import { callbackController, loginController } from './controllers/index.js'

/**
 * Sets up the routes used in the defra customer page.
 * These routes are registered in src/server/router.js.
 */
const auth = {
  plugin: {
    name: 'auth',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: routePaths.authLogin,
          ...loginController
        },
        {
          method: 'POST',
          path: routePaths.authCallback,
          ...callbackController
        }
      ])
    }
  }
}

export { auth }
