import { config } from '~/src/config/index.js'
import { fetchProxyWrapper } from '../../common/helpers/fetchProxyWrapper.js'
import { createLogger } from '../../common/helpers/logging/logger.js'

const nmsConfig = config.get('nms')
const apiPath = nmsConfig.apiPath
const logger = createLogger()

/**
 * Saves or updates a submission by sending data to an external API.
 *
 * This function sends a submission payload to the appropriate endpoint based on whether an `id` is provided.
 * - If `id` is provided, the function performs an update operation using the `PUT` method.
 * - If `id` is not provided, it performs a create operation using the `POST` method.
 *
 * @param {Object} payload - The data to be sent to the API. This should include all necessary fields for the submission.
 * @param {string|null} [id=null] - The unique identifier of the submission to be updated. If not provided, a new submission will be created.
 *
 * @returns {Promise<Object>} - The response from the API, parsed as JSON. This typically includes a message and any relevant data from the API.
 *
 * @throws {Error} - Throws an error if the API request fails or if there is an issue processing the response.
 *
 * @example
 * const payload = { orgName: 'Example Org', orgType: 'type1' };
 * try {
 *   const result = await saveSubmission(payload);
 *   console.log(result);
 * } catch (error) {
 *   console.error('Failed to save submission:', error);
 * }
 */
const saveSubmission = async (payload, id = null) => {
  const apiURI = id
    ? `${apiPath}update/submission/${id}`
    : `${apiPath}create/submission`

  const options = {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(payload)
  }

  try {
    const response = await fetchProxyWrapper(apiURI, options, true)
    return await response.body
  } catch (error) {
    logger.info(`Error in save submission: ${error}`)
    throw error
  }
}

export { saveSubmission }
