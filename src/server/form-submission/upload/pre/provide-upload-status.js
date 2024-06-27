import Boom from '@hapi/boom'
import { httpFetcher } from '~/src/server/common/helpers/http-fetch/http-fetch.js'

const provideUploadStatus = (sessionId) => {
  return {
    method: async (request) => {
      const session = request.yar.get(sessionId)
      if (session.statusUrl) {
        const response = await httpFetcher(session.statusUrl)
        return await response.json
      }
      throw Boom.badRequest('No status url found')
    },
    assign: 'uploadStatus'
  }
}

export { provideUploadStatus }
