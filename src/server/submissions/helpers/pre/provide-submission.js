import { config } from '~/src/config/index.js'
import { fetchProxyWrapper } from '~/src/server/common/helpers/fetchProxyWrapper.js'

const nmsConfig = config.get('nms')
const apiPath = nmsConfig.apiPath

const provideSubmission = {
  method: async (request, h) => {
    const { id } = request.params
    try {
      if (id) {
        const response = await fetchProxyWrapper(
          `${apiPath}read/submission/${request.params.id}`,
          {},
          true
        )
        const { message, document } = await response.body
        if (message === 'success') {
          return document
        }
      }
      return null
    } catch (e) {
      return null
    }
  },
  assign: 'submission'
}

export { provideSubmission }
