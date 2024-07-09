import { routePaths } from '../../common/helpers/constants.js'

const deleteController = {
  handler: async (request, h) => {
    const { id } = request.params
    request.redis.removeData(id)
    return h.redirect(routePaths.redis)
  }
}

export { deleteController }
