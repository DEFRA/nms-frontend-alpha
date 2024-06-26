import { routePaths } from '~/src/server/common/helpers/constants.js'
import { fields } from '../fields.js'
import { config } from '~/src/config/index.js'
import { proxyFetch } from '~/src/server/common/helpers/proxy-fetch.js'

const nmsConfig = config.get('nms')
const apiPath = nmsConfig.apiPath

const indexController = {
  handler: async (request, h) => {
    const { id } = request.params
    request.yar.clear('submission')
    let values = {}
    if (id) {
      const response = await proxyFetch(`${apiPath}read/submission/${id}`)
      const { message, document } = await response.json()
      if (message === 'success') {
        values = document
      }
    }
    return h.view('form-submission/contact/index', {
      pageTitle: 'Contact',
      heading: 'Contact',
      fields,
      values,
      postHandler: routePaths.contact
    })
  }
}

export { indexController }
