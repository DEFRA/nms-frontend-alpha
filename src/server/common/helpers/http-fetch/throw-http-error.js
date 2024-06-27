import Boom from '@hapi/boom'

const throwHttpError = async (message, status) => {
  throw Boom.boomify(new Error(message), {
    statusCode: status
  })
}

export { throwHttpError }
