import { createLogger } from '../logging/logger.js'
import { throwHttpError } from './throw-http-error.js'

const httpFetcher = async (url, options = {}) => {
  const logger = createLogger()
  const response = await fetch(url, {
    ...options,
    method: options?.method || 'get',
    headers: {
      ...(options?.headers && options?.headers),
      'Content-Type': 'application/json'
    }
  })

  try {
    const json = await response.json()

    if (response.ok) {
      return { json, response }
    }

    const message = json?.message ?? response.statusText
    const status = response?.status ?? 500

    throwHttpError(message, status)
  } catch (error) {
    logger.error(error)

    throwHttpError(error.message, error?.output?.statusCode ?? 500)
  }
}

export { httpFetcher }
