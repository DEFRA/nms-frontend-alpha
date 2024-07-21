import Boom from '@hapi/boom'
import { fetchProxyWrapper } from '~/src/server/common/helpers/fetchProxyWrapper.js'

/**
 * Middleware function to provide the upload status from a session.
 *
 * This function returns an object that can be used as middleware in Hapi.js. It retrieves the upload status from a
 * session using the provided session ID and fetches the status from a specified URL. The result is assigned to a
 * property named `uploadStatus` in the request object.
 *
 * @param {string} sessionId - The ID of the session to retrieve the upload status from.
 * @returns {Object} Middleware configuration object.
 * @property {Function} method - Asynchronous function to fetch the upload status.
 * @property {string} assign - The name of the property to assign the upload status to in the request object.
 *
 * @example
 * const uploadStatusMiddleware = provideUploadStatus('submissionSessionId');
 * server.route({
 *   method: 'GET',
 *   path: '/upload/status',
 *   handler: (request, h) => {
 *     // Access the upload status via request.pre.uploadStatus
 *     return h.response(request.pre.uploadStatus);
 *   },
 *   options: {
 *     pre: [uploadStatusMiddleware]
 *   }
 * });
 */
const provideUploadStatus = (sessionId) => {
  return {
    /**
     * Asynchronous function to fetch the upload status from the session.
     *
     * @async
     * @function method
     * @param {Object} request - The Hapi.js request object, which includes session data and other request-related information.
     * @returns {Promise<Object>} The upload status object retrieved from the status URL.
     * @throws {Boom.badRequest} If no status URL is found in the session.
     */
    method: async (request) => {
      // Retrieve the session data using the provided session ID
      const session = request.yar.get(sessionId)

      // Check if the status URL exists in the session
      if (session.statusUrl) {
        // Fetch the upload status from the status URL
        const response = await fetchProxyWrapper(session.statusUrl, {}, true)
        return await response.body
      }

      // Throw an error if no status URL is found
      throw Boom.badRequest('No status url found')
    },
    // Assign the result to `uploadStatus` property in the request object
    assign: 'uploadStatus'
  }
}

export { provideUploadStatus }
