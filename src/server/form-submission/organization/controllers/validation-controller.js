import transformErrors from '~/src/server/common/helpers/transformErrors.js'
import { routePaths } from '../../../common/helpers/constants.js'
import { fields } from '../fields.js'
import organization from '../schema.js'
import { config } from '~/src/config/index.js'
import { proxyFetch } from '~/src/server/common/helpers/proxy-fetch.js'

const nmsConfig = config.get('nms')
const apiPath = nmsConfig.apiPath
const validationController = {
  payload: organization,
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
      .view('form-submission/organization/index', {
        pageTitle: 'Organization',
        heading: 'Organization',
        fields: transformedFields,
        values,
        postHandler: `${routePaths.organization}/${id}`
      })
      .code(400)
      .takeover()
  }
}

export { validationController }
