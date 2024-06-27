import { config } from '~/src/config/index.js'
import { routePaths } from '../../../common/helpers/constants.js'
import { fields } from '../fields.js'
import { proxyFetch } from '~/src/server/common/helpers/proxy-fetch.js'

const nmsConfig = config.get('nms')
const apiPath = nmsConfig.apiPath

const indexController = {
  handler: async (request, h) => {
    const { id } = request.params
    let values = {}
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    if (id) {
      const response = await proxyFetch(
        `${apiPath}read/submission/${id}`,
        options
      )
      const { message, document } = await response.json()
      if (message !== 'success' || document._id !== id) {
        return h.redirect(routePaths.contact)
      } else {
        values = document
      }
    }
    return h.view('form-submission/organization/index', {
      pageTitle: 'Organization',
      heading: 'Organization',
      fields,
      values,
      contactPath: `${routePaths.contact}/${id}`,
      postHandler: `${routePaths.organization}/${id}`
    })
  }
}

export { indexController }
