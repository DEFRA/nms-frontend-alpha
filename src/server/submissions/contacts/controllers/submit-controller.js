import { routePaths } from '~/src/server/common/helpers/constants.js'
import { provideSubmission } from '../../helpers/pre/provide-submission.js'
import contact from '../schema.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { saveSubmission } from '../../services/save-submission.js'
import { generatePayload } from '../generate-payload.js'
import crypto from 'node:crypto'

const submitController = {
  options: {
    pre: [provideSubmission]
  },
  handler: async (request, h) => {
    const { id, cid } = request.params
    const route = `${routePaths.contact}/${id}`
    const { action, ...data } = request.payload
    const submission = request.pre.submission
    const viewPath = 'submissions/contacts/index'
    let contacts = []
    const contactId = cid ?? crypto.randomUUID()
    if (id && !submission) {
      request.logger.info(`Submission record is not found: ${submission}`)
      return h.redirect(routePaths.organization)
    }
    if (submission) {
      contacts = submission?.contacts ?? []
      if (cid && contacts.length) {
        const contact = contacts.find((contact) => contact.cid === cid)
        if (!contact) {
          return h.redirect(route)
        }
      }
    }
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
    const validationResult = contact.validate(data, {
      abortEarly: false
    })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult?.error?.details)

      request.logger.info(
        `Contact submission controller validation error: ${validationResult?.error?.details}`
      )

      return h.view(viewPath, {
        ...routeContext,
        formErrors: errorDetails
      })
    }
    const payloadData = {
      ...submission,
      entity: 'contact',
      status: id ? submission?.status : 'incomplete'
    }
    const payload = await generatePayload(payloadData, data, contactId)
    try {
      const { message, document } = await saveSubmission(payload, id)
      if (message === 'success') {
        return action === 'sac'
          ? h.redirect(`${routePaths.upload}/${document._id}`)
          : h.redirect(`${routePaths.contact}/${document._id}`)
      } else {
        const message = 'Failed to save the document'
        request.logger.info(`Contact submission controller failed: ${message}`)
        return h.view(viewPath, {
          ...routeContext,
          error: message
        })
      }
    } catch (error) {
      request.logger.info(`Contact submission controller error: ${error}`)
      return h.view(viewPath, {
        ...routeContext,
        error: error.message
      })
    }
  }
}

export { submitController }
