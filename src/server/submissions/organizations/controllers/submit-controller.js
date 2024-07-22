import { routePaths } from '../../../common/helpers/constants.js'
import { saveSubmission } from '../../services/save-submission.js'
import { buildOptions } from '~/src/server/common/helpers/build-options.js'
import organization from '../schema.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { provideSubmission, provideOptions } from '../../helpers/pre/index.js'
import { generatePayload } from '../generate-payload.js'

/**
 * Controller for handling the submission of organization data.
 *
 * This controller manages the submission of organization data, including validation, payload generation,
 * and saving to the database. It also handles errors and provides feedback to the user through the view.
 *
 * @constant {Object} submitController - The controller configuration object.
 * @property {Object} options - Configuration options for the route.
 * @property {Array} options.pre - Array of pre-handler functions. Includes `provideSubmission` to fetch existing submission
 *                                  data and `provideOptions` to fetch options for form fields.
 * @property {Function} handler - Asynchronous function to handle the request and response cycle.
 *
 * @param {Object} request - The Hapi.js request object containing information about the HTTP request.
 * @param {Object} h - The Hapi.js response toolkit used to generate and manage responses.
 * @returns {Promise<Object>} A promise that resolves to a Hapi.js response object rendering the view with form values, errors, or redirection.
 *
 * @example
 * server.route({
 *   method: 'POST',
 *   path: '/organizations/{id?}',
 *   handler: submitController.handler,
 *   options: submitController.options
 * });
 */
const submitController = {
  options: {
    pre: [provideSubmission, provideOptions]
  },
  handler: async (request, h) => {
    const data = request.payload
    const { id } = request.params
    const { countries, devType, orgType } = request.pre.options
    const submission = request.pre.submission
    const viewPath = 'submissions/organizations/index'
    const routeContext = {
      pageTitle: 'Organization',
      heading: 'Organization',
      countryOptions: buildOptions(countries, data?.nationality ?? null),
      devTypeOptions: buildOptions(devType, data?.typeOfDeveloper ?? null),
      orgTypeOptions: buildOptions(orgType, data?.orgType ?? null),
      formValues: data,
      postHandler: id
        ? `${routePaths.organization}/${id}`
        : routePaths.organization
    }

    // Redirect if no submission found for provided ID
    if (id && !submission) {
      request.logger.info(`Submission record is not found: ${submission}`)
      return h.redirect(routePaths.organization)
    }

    // Validate form data
    const validationResult = organization.validate(data, {
      abortEarly: false
    })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult?.error?.details)

      request.logger.info(
        `Organization submission controller validation error: ${validationResult?.error?.details}`
      )

      // Render the view with validation errors
      return h.view(viewPath, {
        ...routeContext,
        formErrors: errorDetails
      })
    }

    // Generate payload for submission
    const payloadData = {
      ...submission,
      ...data,
      entity: 'organization',
      status: id ? submission?.status : 'incomplete'
    }
    const payload = await generatePayload(payloadData)

    try {
      // Save the submission and handle success or failure
      const { message, document } = await saveSubmission(payload, id ?? null)
      if (message === 'success') {
        return h.redirect(`${routePaths.contact}/${document._id}`)
      } else {
        const message = 'Failed to save the document'
        request.logger.info(
          `Organization submission controller failed: ${message}`
        )
        return h.view(viewPath, {
          ...routeContext,
          error: message
        })
      }
    } catch (error) {
      request.logger.info(`Organization submission controller error: ${error}`)
      return h.view(viewPath, {
        ...routeContext,
        error: error.message
      })
    }
  }
}

export { submitController }
