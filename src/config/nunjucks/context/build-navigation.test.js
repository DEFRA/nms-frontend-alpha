import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation.js'

const mockRequest = ({ path } = {}) => ({
  path
})

describe('#buildNavigation', () => {
  test('Should provide expected navigation details', () => {
    expect(
      buildNavigation(mockRequest({ path: '/non-existent-path' }))
    ).toEqual([
      {
        isActive: false,
        text: 'Home',
        url: '/'
      },
      {
        isActive: false,
        text: 'About',
        url: '/about'
      },
      {
        isActive: false,
        text: 'Submissions',
        url: '/submission'
      },
      {
        isActive: false,
        text: 'Redis',
        url: '/redis'
      }
    ])
  })

  test('Should provide expected highlighted navigation details', () => {
    expect(buildNavigation(mockRequest({ path: '/' }))).toEqual([
      {
        isActive: true,
        text: 'Home',
        url: '/'
      },
      {
        isActive: false,
        text: 'About',
        url: '/about'
      },
      {
        isActive: false,
        text: 'Submissions',
        url: '/submission'
      },
      {
        isActive: false,
        text: 'Redis',
        url: '/redis'
      }
    ])
  })
})
