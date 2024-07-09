import { routePaths } from '~/src/server/common/helpers/constants.js'

function buildNavigation(request) {
  return [
    {
      text: 'Home',
      url: routePaths.home,
      isActive: request.path === routePaths.home
    },
    {
      text: 'About',
      url: routePaths.about,
      isActive: request.path === routePaths.about
    },
    {
      text: 'Submissions',
      url: routePaths.submission,
      isActive: request.path === routePaths.submission
    }
  ]
}

export { buildNavigation }
