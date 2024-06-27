import { config } from '~/src/config/index.js'
import { httpFetcher } from '~/src/server/common/helpers/http-fetch/http-fetch.js'

const initializeUpload = async (options = {}) => {
  const {
    redirect,
    callback,
    s3Bucket,
    s3Path,
    mimeTypes,
    maxFileSize,
    metadata
  } = options

  const endpointUrl = config.get('cdpUploaderUrl') + '/initiate'
  const response = await httpFetcher(endpointUrl, {
    method: 'POST',
    body: JSON.stringify({
      redirect,
      callback,
      s3Bucket,
      s3Path,
      mimeTypes,
      maxFileSize,
      metadata
    })
  })
  return await response.json
}

export { initializeUpload }
