import { buildOptions } from '~/src/server/common/helpers/build-options.js'
import { routePaths } from '../../../common/helpers/constants.js'
import { provideOptions, provideSubmission } from '../../helpers/pre/index.js'

/**
 * Controller for handling requests to the organization submission index page.
 *
 * This controller manages the rendering of the view for the organization submission page. It populates the form
 * with values from a submission if available and provides options for countries, types of developers, and types
 * of organizations. The controller also handles redirection if no submission is found for a given ID.
 *
 * @constant {Object} indexController - The controller configuration object.
 * @property {Object} options - Configuration options for the route.
 * @property {Array} options.pre - Array of pre-handler functions. Includes `provideSubmission` to populate submission data
 *                                  and `provideOptions` to fetch and provide option data for the form.
 * @property {Function} handler - Asynchronous function to handle the request and response cycle.
 *
 * @param {Object} request - The Hapi.js request object containing information about the HTTP request.
 * @param {Object} h - The Hapi.js response toolkit used to generate and manage responses.
 * @returns {Promise<Object>} A promise that resolves to a Hapi.js response object rendering the view with form values and options.
 *
 * @example
 * server.route({
 *   method: 'GET',
 *   path: '/organizations/{id?}',
 *   handler: indexController.handler,
 *   options: indexController.options
 * });
 */
const indexController = {
  options: {
    pre: [provideSubmission, provideOptions]
  },
  handler: async (request, h) => {
    const { id } = request.params
    const { countries, devType, orgType } = request.pre.options
    let values = {}

    // If an ID is provided, attempt to populate form values from submission
    if (id) {
      const submission = request.pre.submission
      if (submission) {
        values = submission
      } else {
        // Redirect to organization route if no submission is found
        return h.redirect(routePaths.organization)
      }
    }

    // Render the view with form values and options for countries, developer types, and organization types
    return h.view('submissions/organizations/index', {
      pageTitle: 'Organization',
      heading: 'Organization',
      formValues: values,
      countryOptions: buildOptions(countries, values?.nationality ?? null),
      devTypeOptions: buildOptions(devType, values?.typeOfDeveloper ?? null),
      orgTypeOptions: buildOptions(orgType, values?.orgType ?? null),
      postHandler: id
        ? `${routePaths.organization}/${id}`
        : routePaths.organization
    })
  }
}

export { indexController }
