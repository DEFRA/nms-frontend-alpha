import { routePaths } from '../../../common/helpers/constants.js'
import { saveSubmission } from '../../services/save-submission.js'
import { buildOptions } from '~/src/server/common/helpers/build-options.js'
import organization from '../schema.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { provideSubmission, provideOptions } from '../../helpers/pre/index.js'
import { generatePayload } from '../generate-payload.js'

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
    if (id && !submission) {
      request.logger.info(`Submission record is not found: ${submission}`)
      return h.redirect(routePaths.organization)
    }
    const validationResult = organization.validate(data, {
      abortEarly: false
    })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult?.error?.details)

      request.logger.info(
        `Organization submission controller validation error: ${validationResult?.error?.details}`
      )

      return h.view(viewPath, {
        ...routeContext,
        formErrors: errorDetails
      })
    }
    const payloadData = {
      ...submission,
      ...data,
      entity: 'organization',
      status: id ? submission?.status : 'incomplete'
    }
    const payload = await generatePayload(payloadData)
    try {
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
