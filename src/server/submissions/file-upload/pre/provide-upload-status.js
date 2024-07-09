import Boom from '@hapi/boom'
import { fetchProxyWrapper } from '~/src/server/common/helpers/fetchProxyWrapper.js'

const provideUploadStatus = (sessionId) => {
  return {
    method: async (request) => {
      const session = request.yar.get(sessionId)
      if (session.statusUrl) {
        const response = await fetchProxyWrapper(session.statusUrl, {}, true)
        return await response.json
      }
      throw Boom.badRequest('No status url found')
    },
    assign: 'uploadStatus'
  }
}

export { provideUploadStatus }
