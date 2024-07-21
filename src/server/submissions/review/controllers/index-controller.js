import { routePaths } from '../../../common/helpers/constants.js'
import optionsLabel from '../../helpers/option-label.js'
import { provideOptions, provideSubmission } from '../../helpers/pre/index.js'

/**
 * Controller for handling requests to the review page of the submission.
 *
 * This controller is responsible for rendering the review page where users can review their submission details.
 * It retrieves options and submission data, then displays them on the review page. If no submission data is available,
 * or if the submission ID is not provided, the user is redirected to the organization page.
 *
 * @module indexController
 */
const indexController = {
  options: {
    /**
     * Pre-handler methods that fetch necessary data before executing the main handler.
     *
     * - `provideSubmission`: Fetches the submission details based on the request parameters.
     * - `provideOptions`: Retrieves the options (e.g., countries, developer types, organization types) needed for the view.
     */
    pre: [provideSubmission, provideOptions]
  },
  handler: async (request, h) => {
    const { id } = request.params
    request.logger.info(`Route Name: ${request.route.path}`)

    if (id) {
      const { countries, devType, orgType } = request.pre.options
      const submission = request.pre.submission
      const editRoute = `${routePaths.organization}/${id}`
      const contactEditRoute = `${routePaths.contact}/${id}`

      if (submission) {
        // Retrieve labels for the submission data based on the provided options
        const nationalityLabel = await optionsLabel(
          countries,
          submission?.nationality ?? null
        )
        const typeOfDevLabel = await optionsLabel(
          devType,
          submission?.typeOfDeveloper ?? null
        )
        const typeOfOrgLabel = await optionsLabel(
          orgType,
          submission?.orgType ?? null
        )

        return h.view('submissions/review/index', {
          pageTitle: 'Review',
          data: submission,
          nationalityLabel,
          typeOfDevLabel,
          typeOfOrgLabel,
          editRoute,
          contactEditRoute,
          heading: 'Review'
        })
      } else {
        // Redirect to the organization page if no submission data is found
        return h.redirect(routePaths.organization)
      }
    } else {
      // Redirect to the organization page if no ID is provided
      return h.redirect(routePaths.organization)
    }
  }
}

export { indexController }
