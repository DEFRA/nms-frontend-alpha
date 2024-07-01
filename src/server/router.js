import inert from '@hapi/inert'

import { health } from '~/src/server/health/index.js'
import { home } from '~/src/server/home/index.js'
import { serveStaticFiles } from '~/src/server/common/helpers/serve-static-files.js'
import { about } from '~/src/server/about/index.js'
import {
  contact,
  organization,
  review,
  upload
} from '~/src/server/form-submission/index.js'
import { files } from '~/src/server/files/index.js'

const router = {
  plugin: {
    name: 'router',
    register: async (server) => {
      await server.register([inert])

      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])

      // Application specific routes, add your own routes here
      await server.register([
        home,
        about,
        files,
        contact,
        organization,
        upload,
        review
      ])

      // Static assets
      await server.register([serveStaticFiles])
    }
  }
}

export { router }
