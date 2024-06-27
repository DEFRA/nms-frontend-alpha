import transformErrors from '~/src/server/common/helpers/transformErrors.js'
import { fields } from '../fields.js'
import contact from '../schema.js'
import { routePaths } from '~/src/server/common/helpers/constants.js'
import { config } from '~/src/config/index.js'
import { proxyFetch } from '~/src/server/common/helpers/proxy-fetch.js'

const nmsConfig = config.get('nms')
const apiPath = nmsConfig.apiPath

const validationController = {
  payload: contact,
  failAction: async (request, h, e) => {
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
      if (message === 'success') {
        values = document
      }
    }
    const transformedFields = await transformErrors({ ...fields }, e)
    return h
      .view('form-submission/contact/index', {
        pageTitle: 'Contact',
        heading: 'Contact',
        fields: transformedFields,
        values,
        postHandler: routePaths.contact
      })
      .code(400)
      .takeover()
  }
}

export { validationController }
