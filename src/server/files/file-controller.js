import Joi from 'joi'
import { GetObjectCommand } from '@aws-sdk/client-s3'

import { config } from '~/src/config'
import { s3Client } from '~/src/server/common/helpers/s3-client'

/**
 * Provides access to files in the s3 bucket.
 * !! Note, this is NOT how you should do it in a real production system !!
 * You should verify that the requester actually has permissions to access the requested
 * resource before serving it up.
 */
const fileController = {
  options: {
    validate: {
      params: Joi.object({
        s3Key: Joi.string().required()
      })
    }
  },
  handler: async (request, h) => {
    const s3Key = decodeURIComponent(request.params.s3Key)
    const command = new GetObjectCommand({
      Bucket: config.get('bucket'),
      Key: s3Key
    })

    try {
      const response = await s3Client.send(command)
      return h
        .response(response.Body)
        .header('Content-Type', response.ContentType)
        .code(200)
    } catch (err) {
      request.logger.error(err)
      return h.response('File Not Found').code(404)
    }
  }
}

export { fileController }
