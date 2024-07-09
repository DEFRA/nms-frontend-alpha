import { config } from '~/src/config/index.js'
import { fetchProxyWrapper } from '../../common/helpers/fetchProxyWrapper.js'
import { createLogger } from '../../common/helpers/logging/logger.js'

const nmsConfig = config.get('nms')
const apiPath = nmsConfig.apiPath
const logger = createLogger()

const saveSubmission = async (payload, id = null) => {
  const apiURI = id
    ? `${apiPath}update/submission/${id}`
    : `${apiPath}create/submission`

  const options = {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(payload)
  }

  try {
    const response = await fetchProxyWrapper(apiURI, options, true)
    return await response.body
  } catch (error) {
    logger.info(`Error in save submission: ${error}`)
    throw error
  }
}

export { saveSubmission }
