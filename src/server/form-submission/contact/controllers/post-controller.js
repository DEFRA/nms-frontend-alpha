import { config } from '~/src/config/index.js'
import { routePaths } from '~/src/server/common/helpers/constants.js'
import { fields } from '../fields.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { httpFetcher } from '~/src/server/common/helpers/http-fetch/http-fetch.js'

const nmsConfig = config.get('nms')
const apiPath = nmsConfig.apiPath

const postController = {
  handler: async (request, h) => {
    const logger = createLogger()
    const { action, ...data } = request.payload
    const payload = { ...data, entity: 'contact', status: 'incomplete' }
    const options = {
      method: 'POST',
      body: JSON.stringify(payload)
    }
    const { contact, organization } = routePaths
    const routeContext = {
      pageTitle: 'Contact',
      heading: 'Contact',
      fields,
      postHandler: routePaths.contact
    }
    try {
      const response = await httpFetcher(`${apiPath}create/submission`, options)
      const { message, document } = await response.json
      if (message === 'success') {
        const route = action === 'sac' ? organization : contact
        return h.redirect(`${route}/${document._id}`)
      } else {
        logger.error('Failed to save the document')
        return h.view('form-submission/contact/index', {
          ...routeContext,
          error: 'Failed to save the document'
        })
      }
    } catch (error) {
      logger.error(error)
      return h.view('form-submission/contact/index', {
        ...routeContext,
        error: error.message
      })
    }
  }
}

export { postController }
