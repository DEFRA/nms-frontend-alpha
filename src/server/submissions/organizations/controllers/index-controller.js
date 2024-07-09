import { buildOptions } from '~/src/server/common/helpers/build-options.js'
import { routePaths } from '../../../common/helpers/constants.js'
import { provideOptions, provideSubmission } from '../../helpers/pre/index.js'

const indexController = {
  options: {
    pre: [provideSubmission, provideOptions]
  },
  handler: async (request, h) => {
    const { id } = request.params
    const { countries, devType, orgType } = request.pre.options
    let values = {}
    if (id) {
      const submission = request.pre.submission
      if (submission) {
        values = submission
      } else {
        return h.redirect(routePaths.organization)
      }
    }
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
