import { routePaths } from '../../../common/helpers/constants.js'
import optionsLabel from '../../helpers/option-label.js'
import { provideOptions } from '../../helpers/pre/index.js'
import { config } from '~/src/config/index.js'
import { fetchProxyWrapper } from '~/src/server/common/helpers/fetchProxyWrapper.js'

// Retrieve NMS configuration and API path from the application settings
const nmsConfig = config.get('nms')
const apiPath = nmsConfig.apiPath

/**
 * Controller for handling requests to the index page for organizations.
 *
 * This controller fetches a list of submissions from an external service and processes each submission to add
 * human-readable labels for the type of developer and organization. The processed documents are then passed
 * to a view for rendering. If there is an error in fetching or processing the data, an error message is included
 * in the view.
 *
 * @constant {Object} indexController - The controller configuration object.
 * @property {Object} options - Configuration options for the route.
 * @property {Array} options.pre - Array of pre-handler functions. In this case, it includes `provideOptions` to populate option data.
 * @property {Function} handler - Asynchronous function to handle the request and response cycle.
 *
 * @param {Object} request - The Hapi.js request object containing information about the HTTP request.
 * @param {Object} h - The Hapi.js response toolkit used to generate and manage responses.
 * @returns {Promise<Object>} A promise that resolves to a Hapi.js response object rendering the view.
 *
 * @example
 * server.route({
 *   method: 'GET',
 *   path: '/organizations',
 *   handler: indexController.handler,
 *   options: indexController.options
 * });
 */
const indexController = {
  options: {
    pre: [provideOptions]
  },
  handler: async (request, h) => {
    // Extract options data from pre-handlers
    const { devType, orgType } = request.pre.options
    let updatedDocuments = []
    const viewPath = 'submissions/list/index'
    const context = {
      pageTitle: 'Organizations',
      heading: 'Organizations',
      updatedDocuments,
      editRoute: `${routePaths.organization}`,
      reviewRoute: `${routePaths.review}`
    }
    try {
      // Fetch the list of submissions from the external API
      const response = await fetchProxyWrapper(
        `${apiPath}list/submission`,
        {},
        true
      )
      const { message, documents } = await response.body
      if (message === 'success') {
        if (documents.length > 0) {
          // Process each document to include labels for type of developer and organization
          const updatedDocumentsPromises = documents.map(async (document) => ({
            ...document,
            typeOfDevLabel: await optionsLabel(
              devType,
              document?.typeOfDeveloper ?? null
            ),
            typeOfOrgLabel: await optionsLabel(
              orgType,
              document?.orgType ?? null
            )
          }))
          updatedDocuments = await Promise.all(updatedDocumentsPromises)
        }
        // Render the view with updated documents
        return h.view(viewPath, {
          ...context,
          updatedDocuments
        })
      } else {
        // Render the view with an error message if the fetch was not successful
        return h.view(viewPath, {
          ...context,
          error: 'Unable to fetch the list of organizations'
        })
      }
    } catch (error) {
      // Log the error and render the view with an error message
      request.logger.info(`Organization submission controller error: ${error}`)
      return h.view(viewPath, {
        ...context,
        error: error.message
      })
    }
  }
}

export { indexController }
