import { config } from '~/src/config/index.js'
import { fetchProxyWrapper } from '~/src/server/common/helpers/fetchProxyWrapper.js'

// Retrieve NMS configuration and API path from the application settings
const nmsConfig = config.get('nms')
const apiPath = nmsConfig.apiPath

/**
 * Middleware function to provide a submission document.
 *
 * This middleware function retrieves a submission document based on the provided `id` from the request parameters.
 * It interacts with an external service to fetch the document. If the fetch operation is successful and the response
 * message is 'success', it returns the document. If there is an error or the `id` is not provided, it returns `null`.
 * The result is assigned to a property named `submission` in the request object.
 *
 * @constant {Object} provideSubmission - The middleware configuration object.
 * @property {Function} method - Asynchronous function to fetch and provide the submission document.
 * @property {string} assign - The name of the property to assign the submission document to in the request object.
 *
 * @returns {Promise<Object|null>} The submission document if the fetch is successful, or `null` if there is an error
 * or if the `id` is not provided.
 *
 * @throws {Error} This function does not explicitly throw errors; it returns `null` in case of an error.
 *
 * @example
 * const submissionMiddleware = provideSubmission;
 * server.route({
 *   method: 'GET',
 *   path: '/submission/{id}',
 *   handler: (request, h) => {
 *     // Access the submission document via request.pre.submission
 *     return h.response(request.pre.submission);
 *   },
 *   options: {
 *     pre: [submissionMiddleware]
 *   }
 * });
 */
const provideSubmission = {
  /**
   * Asynchronous function to fetch and provide a submission document.
   *
   * This function retrieves the `id` from the request parameters, then makes a request to an external service to fetch
   * the corresponding submission document. If the request is successful and the response message is 'success', it returns
   * the document. Otherwise, it returns `null`.
   *
   * @async
   * @function method
   * @param {Object} request - The Hapi.js request object, which includes the request parameters and other request-related data.
   * @param {Object} h - The response toolkit used to generate and manage responses.
   * @returns {Promise<Object|null>} The submission document if the fetch is successful, otherwise `null`.
   */
  method: async (request, h) => {
    const { id } = request.params
    try {
      if (id) {
        // Construct the URL to fetch the submission document
        const response = await fetchProxyWrapper(
          `${apiPath}read/submission/${request.params.id}`,
          {},
          true
        )
        // Extract the message and document from the response body
        const { message, document } = await response.body
        if (message === 'success') {
          return document
        }
      }
      return null
    } catch (e) {
      // Return null in case of an error
      return null
    }
  },

  // Assign the result to `submission` property in the request object
  assign: 'submission'
}

export { provideSubmission }
