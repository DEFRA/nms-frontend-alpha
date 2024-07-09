import { routePaths } from '../../../common/helpers/constants.js'
import optionsLabel from '../../helpers/option-label.js'
import { provideOptions, provideSubmission } from '../../helpers/pre/index.js'

const indexController = {
  options: {
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
        return h.view('submissions/review/index', {
          pageTitle: 'Review',
          data: submission,
          nationalityLabel: await optionsLabel(
            countries,
            submission?.nationality ?? null
          ),
          typeOfDevLabel: await optionsLabel(
            devType,
            submission?.typeOfDeveloper ?? null
          ),
          typeOfOrgLabel: await optionsLabel(
            orgType,
            submission?.orgType ?? null
          ),
          editRoute,
          contactEditRoute,
          heading: 'Review'
        })
      } else {
        return h.redirect(routePaths.organization)
      }
    } else {
      return h.redirect(routePaths.organization)
    }
  }
}

export { indexController }
