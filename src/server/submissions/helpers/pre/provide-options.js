import { config } from '~/src/config/index.js'
import { redisKeys } from '~/src/server/common/helpers/constants.js'
import { fetchProxyWrapper } from '~/src/server/common/helpers/fetchProxyWrapper.js'

// Retrieve NMS configuration and API path from the application settings
const nmsConfig = config.get('nms')
const apiPath = nmsConfig.apiPath

// Define endpoints for fetching various options from the external service
const countriesEndPoint = `${apiPath}entity-options/nm_countries`
const devTypeEndPoint = `${apiPath}options-definition/nm_typeofdeveloper`
const orgTypeEndPoint = `${apiPath}options-definition/nm_contacttype`

/**
 * Middleware function to provide various options by fetching from cache or external service.
 *
 * This middleware function first attempts to retrieve data from Redis cache. If the data is not present in the cache,
 * it fetches the data from the external service using predefined API endpoints. After fetching, it updates the Redis
 * cache with the new data. The fetched or cached data includes countries, developer types, and organization types.
 * The results are assigned to a property named `options` in the request object.
 *
 * @constant {Object} provideOptions - The middleware configuration object.
 * @property {Function} method - Asynchronous function to fetch and provide options data.
 * @property {string} assign - The name of the property to assign the options data to in the request object.
 *
 * @returns {Object} The options data, including countries, developer types, and organization types.
 * @throws {Error} Throws an error if there is a failure in fetching data from the external service.
 *
 * @example
 * const optionsMiddleware = provideOptions;
 * server.route({
 *   method: 'GET',
 *   path: '/options',
 *   handler: (request, h) => {
 *     // Access the options via request.pre.options
 *     return h.response(request.pre.options);
 *   },
 *   options: {
 *     pre: [optionsMiddleware]
 *   }
 * });
 */
const provideOptions = {
  /**
   * Asynchronous function to fetch and provide options data.
   *
   * This function retrieves options data from Redis cache if available. If not, it fetches the data from an external
   * service using predefined API endpoints. The fetched data is then cached in Redis for future use.
   *
   * @async
   * @function method
   * @param {Object} request - The Hapi.js request object, which includes Redis cache and logger.
   * @param {Object} h - The response toolkit used to generate and manage responses.
   * @returns {Promise<Object>} The options data, including countries, developer types, and organization types.
   * @throws {Error} Throws an error if the fetching process fails.
   */
  method: async (request, h) => {
    try {
      // Attempt to retrieve data from Redis cache
      const [cachedCountries, cachedDevType, cachedOrgType] = await Promise.all(
        [
          request.redis.getData(redisKeys.countries),
          request.redis.getData(redisKeys.developerType),
          request.redis.getData(redisKeys.orgType)
        ]
      )

      let countries = cachedCountries ?? null
      let devType = cachedDevType ?? null
      let orgType = cachedOrgType ?? null

      // Prepare to fetch data from external service if not found in cache
      const apiCalls = []
      if (!countries)
        apiCalls.push(fetchProxyWrapper(countriesEndPoint, {}, true))
      if (!devType) apiCalls.push(fetchProxyWrapper(devTypeEndPoint, {}, true))
      if (!orgType) apiCalls.push(fetchProxyWrapper(orgTypeEndPoint, {}, true))
      if (apiCalls.length) {
        request.logger.info(`Fetching from DataVerse`)
        const responses = await Promise.all(apiCalls)

        let index = 0
        if (!countries) countries = responses[index++].body?.data
        if (!devType) devType = responses[index++].body?.data
        if (!orgType) orgType = responses[index++].body?.data

        // Cache the fetched data in Redis
        if (!cachedCountries)
          request.redis.storeData(redisKeys.countries, countries)
        if (!cachedDevType)
          request.redis.storeData(redisKeys.developerType, devType)
        if (!cachedOrgType) request.redis.storeData(redisKeys.orgType, orgType)

        return {
          countries,
          devType,
          orgType
        }
      }

      request.logger.info(`Fetching from Redis cache`)
      return {
        countries: cachedCountries,
        devType: cachedDevType,
        orgType: cachedOrgType
      }
    } catch (error) {
      request.logger.info(`Error fetching options: ${error}`)
      throw error
    }
  },

  // Assign the result to `options` property in the request object
  assign: 'options'
}

export { provideOptions }
