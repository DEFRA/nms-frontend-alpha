import { config } from '~/src/config/index.js'
import { redisKeys } from '~/src/server/common/helpers/constants.js'
import { fetchProxyWrapper } from '~/src/server/common/helpers/fetchProxyWrapper.js'

const nmsConfig = config.get('nms')
const apiPath = nmsConfig.apiPath

const countriesEndPoint = `${apiPath}entity-options/nm_countries`
const devTypeEndPoint = `${apiPath}options-definition/nm_typeofdeveloper`
const orgTypeEndPoint = `${apiPath}options-definition/nm_contacttype`

const provideOptions = {
  method: async (request, h) => {
    try {
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

      const apiCalls = []
      if (!countries) apiCalls.push(fetchProxyWrapper(countriesEndPoint))
      if (!devType) apiCalls.push(fetchProxyWrapper(devTypeEndPoint))
      if (!orgType) apiCalls.push(fetchProxyWrapper(orgTypeEndPoint))
      if (apiCalls.length) {
        request.logger.info(`Fetching from DataVerse`)
        const responses = await Promise.all(apiCalls)

        let index = 0
        if (!countries) countries = responses[index++].body?.data
        if (!devType) devType = responses[index++].body?.data
        if (!orgType) orgType = responses[index++].body?.data

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
  assign: 'options'
}

export { provideOptions }
