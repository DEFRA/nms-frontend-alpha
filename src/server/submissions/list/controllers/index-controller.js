import { routePaths } from '../../../common/helpers/constants.js'
import optionsLabel from '../../helpers/option-label.js'
import { provideOptions } from '../../helpers/pre/index.js'
import { config } from '~/src/config/index.js'
import { fetchProxyWrapper } from '~/src/server/common/helpers/fetchProxyWrapper.js'

const nmsConfig = config.get('nms')
const apiPath = nmsConfig.apiPath

const indexController = {
  options: {
    pre: [provideOptions]
  },
  handler: async (request, h) => {
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
      const response = await fetchProxyWrapper(
        `${apiPath}list/submission`,
        {},
        true
      )
      const { message, documents } = await response.body
      if (message === 'success') {
        if (documents.length > 0) {
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
        return h.view(viewPath, {
          ...context,
          updatedDocuments
        })
      } else {
        return h.view(viewPath, {
          ...context,
          error: 'Unable to fetch the list of organizations'
        })
      }
    } catch (error) {
      request.logger.info(`Organization submission controller error: ${error}`)
      return h.view(viewPath, {
        ...context,
        error: error.message
      })
    }
  }
}

export { indexController }
