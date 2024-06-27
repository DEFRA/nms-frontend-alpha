import { config } from '~/src/config/index.js'
// import { routePaths } from '../common/helpers/constants.js'

/**
 * A GDS styled example home page controller.
 * Provided as an example, remove or modify as required.
 */
const homeController = {
  handler: (request, h) => {
    return h.response({ ...config })
    // return h.view('home/index', {
    //   pageTitle: 'Home',
    //   heading: 'Home',
    //   contactPath: routePaths.contact
    // })
  }
}

export { homeController }
