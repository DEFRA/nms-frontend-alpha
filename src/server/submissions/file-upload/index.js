import { routePaths } from '../../common/helpers/constants.js'
import { provideFormContextValues } from '../../common/helpers/form/provide-form-context-values.js'
import { indexController } from './controllers/index-controller.js'
import { statusController } from './controllers/status-controller.js'

/**
 * Sets up the routes used in the upload page.
 * These routes are registered in src/server/router.js.
 */
const upload = {
  plugin: {
    name: 'upload',
    register: async (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideFormContextValues(),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        }
      ])

      server.route([
        {
          method: 'GET',
          path: `${routePaths.upload}/{id}`,
          ...indexController
        },
        {
          method: 'GET',
          path: `${routePaths.uploadComplete}/{id}`,
          ...statusController
        }
      ])
    }
  }
}

export { upload }
