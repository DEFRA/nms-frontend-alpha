import { routePaths } from '~/src/server/common/helpers/constants.js'
import { provideSubmission } from '../../helpers/pre/provide-submission.js'
import contact from '../schema.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { saveSubmission } from '../../services/save-submission.js'
import { generatePayload } from '../generate-payload.js'
import crypto from 'node:crypto'

/**
 * Controller for handling contact submission requests.
 *
 * @constant {Object} submitController - The controller object with `options` and `handler` properties.
 * @property {Object} options - Configuration options for the controller.
 * @property {Array} options.pre - Array of functions to execute before the handler. Includes `provideSubmission`.
 * @property {Function} handler - Asynchronous function that processes the incoming request and generates a response.
 */
const submitController = {
  /**
   * Configuration options for the controller.
   *
   * @type {Object}
   * @property {Array<Function>} pre - Array of functions to be executed before the handler. Includes `provideSubmission`.
   */
  options: {
    pre: [provideSubmission]
  },

  /**
   * Handles the request for submitting contact data.
   *
   * @async
   * @function handler
   * @param {Object} request - The request object, which includes route parameters, payload, and pre handler data.
   * @param {Object} h - The response toolkit.
   * @returns {Promise<Object>} The response object, which could be a view or a redirect.
   */
  handler: async (request, h) => {
    // Extract parameters from the request
    const { id, cid } = request.params
    const route = `${routePaths.contact}/${id}`
    const { action, ...data } = request.payload
    const submission = request.pre.submission
    const viewPath = 'submissions/contacts/index'
    let contacts = []
    const contactId = cid ?? crypto.randomUUID()

    // Redirect if `id` is provided but no submission is found
    if (id && !submission) {
      request.logger.info(`Submission record is not found: ${submission}`)
      return h.redirect(routePaths.organization)
    }

    // If a submission is found, validate contact data
    if (submission) {
      contacts = submission?.contacts ?? []
      if (cid && contacts.length) {
        const contact = contacts.find((contact) => contact.cid === cid)
        if (!contact) {
          return h.redirect(route)
        }
      }
    }

    // Define context for rendering the view
    const routeContext = {
      pageTitle: 'Contact',
      heading: 'Contact',
      formValues: data,
      route,
      contacts,
      postHandler: cid ? `${route}/${cid}` : route,
      orgPath: `${routePaths.organization}/${id}`,
      uploadPath: `${routePaths.upload}/${id}`
    }

    // Validate the submitted data
    const validationResult = contact.validate(data, {
      abortEarly: false
    })

    if (validationResult?.error) {
      // Build error details and log validation error
      const errorDetails = buildErrorDetails(validationResult?.error?.details)

      request.logger.info(
        `Contact submission controller validation error: ${validationResult?.error?.details}`
      )

      // Render the view with validation errors
      return h.view(viewPath, {
        ...routeContext,
        formErrors: errorDetails
      })
    }

    // Generate the payload for submission
    const payloadData = {
      ...submission,
      entity: 'contact',
      status: id ? submission?.status : 'incomplete'
    }
    const payload = await generatePayload(payloadData, data, contactId)

    try {
      // Attempt to save the submission
      const { message, document } = await saveSubmission(payload, id)
      if (message === 'success') {
        // Redirect based on action type
        return action === 'sac'
          ? h.redirect(`${routePaths.upload}/${document._id}`)
          : h.redirect(`${routePaths.contact}/${document._id}`)
      } else {
        // Log failure and render the view with an error message
        const message = 'Failed to save the document'
        request.logger.info(`Contact submission controller failed: ${message}`)
        return h.view(viewPath, {
          ...routeContext,
          error: message
        })
      }
    } catch (error) {
      // Log unexpected errors and render the view with the error message
      request.logger.info(`Contact submission controller error: ${error}`)
      return h.view(viewPath, {
        ...routeContext,
        error: error.message
      })
    }
  }
}

export { submitController }
