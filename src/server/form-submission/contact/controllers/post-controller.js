import { config } from '~/src/config/index.js'
import { routePaths } from '~/src/server/common/helpers/constants.js'
import { fields } from '../fields.js'
import { proxyFetch } from '~/src/server/common/helpers/proxy-fetch.js'

const nmsConfig = config.get('nms')
const apiPath = nmsConfig.apiPath

const postController = {
  handler: async (request, h) => {
    const { action, ...data } = request.payload
    const payload = { ...data, entity: 'contact', status: 'incomplete' }
    const options = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const { contact, organization } = routePaths
    const routeContext = {
      pageTitle: 'Contact',
      heading: 'Contact',
      fields,
      postHandler: routePaths.contact
    }
    try {
      const response = await proxyFetch(`${apiPath}create/submission`, options)
      const { message, document } = await response.json()
      if (message === 'success') {
        const route = action === 'sac' ? organization : contact
        return h.redirect(`${route}/${document._id}`)
      } else {
        return h.view('form-submission/contact/index', {
          ...routeContext,
          error: 'Failed to save the document'
        })
      }
    } catch (error) {
      return h.view('form-submission/contact/index', {
        ...routeContext,
        error: error.message
      })
    }
  }
}

export { postController }
