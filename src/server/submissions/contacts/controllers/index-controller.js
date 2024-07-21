import { routePaths } from '../../../common/helpers/constants.js'
import { provideSubmission } from '../../helpers/pre/index.js'

/**
 * Controller for handling requests related to contact submissions.
 *
 * @constant {Object} indexController - The controller object with `options` and `handler` properties.
 * @property {Object} options - Configuration options for the controller.
 * @property {Array} options.pre - Array of functions to execute before the handler. Includes `provideSubmission`.
 * @property {Function} handler - Asynchronous function that handles the incoming request and generates a response.
 */
const indexController = {
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
   * Handles the request for viewing or redirecting based on contact data.
   *
   * @async
   * @function handler
   * @param {Object} request - The request object, which includes route parameters and pre handler data.
   * @param {Object} h - The response toolkit.
   * @returns {Promise<Object>} The response object, which could be a view or a redirect.
   */
  handler: async (request, h) => {
    // Extract parameters from the request
    const { id, cid } = request.params
    let values = {}
    const route = `${routePaths.contact}/${id}`
    let contacts = []

    // Check if `id` is provided in the request parameters
    if (id) {
      // Access pre-handler data
      const submission = request.pre.submission
      if (submission) {
        // Retrieve contacts from the submission data
        contacts = submission?.contacts ?? []
        // If `cid` is provided, find the corresponding contact
        if (cid && contacts.length) {
          const contact = contacts.find((contact) => contact.cid === cid)
          if (Object.keys(contact).length) {
            // Set the contact data if found
            values = contact
          } else {
            // Redirect to the contact route if contact not found
            return h.redirect(route)
          }
        }
      } else {
        // Redirect to the organization route if no submission data
        return h.redirect(routePaths.organization)
      }
    } else {
      // Redirect to the organization route if no `id` is provided
      return h.redirect(routePaths.organization)
    }

    // Render the view with contact data and paths
    return h.view('submissions/contacts/index', {
      pageTitle: 'Contact',
      heading: 'Contact',
      formValues: values,
      route,
      contacts,
      postHandler: cid ? `${route}/${cid}` : route,
      orgPath: `${routePaths.organization}/${id}`,
      uploadPath: `${routePaths.upload}/${id}`
    })
  }
}

export { indexController }
