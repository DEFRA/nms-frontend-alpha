import { config } from '~/src/config/index.js'
import { routePaths } from '../../../common/helpers/constants.js'
import { fields } from '../fields.js'
import { proxyFetch } from '~/src/server/common/helpers/proxy-fetch.js'

const nmsConfig = config.get('nms')
const apiPath = nmsConfig.apiPath

const postController = {
  handler: async (request, h) => {
    const { action, ...data } = request.payload
    const { id } = request.params
    const payload = { ...data, entity: 'organization', status: 'incomplete' }
    const options = {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const { organization, upload } = routePaths
    const routeContext = {
      pageTitle: 'Organization',
      heading: 'Organization',
      fields,
      contactPath: `${routePaths.contact}/${id}`,
      postHandler: `${routePaths.organization}/${id}`
    }

    try {
      const response = await proxyFetch(
        `${apiPath}update/submission/${id}`,
        options
      )
      const { message, document } = await response.json()
      if (message === 'success') {
        const route = action === 'sac' ? upload : organization
        return h.redirect(`${route}/${document._id}`)
      } else {
        return h.view('form-submission/organization/index', {
          ...routeContext,
          error: 'Failed to update the document'
        })
      }
    } catch (error) {
      return h.view('form-submission/organization/index', {
        ...routeContext,
        error: error.message
      })
    }
  }
}

export { postController }
