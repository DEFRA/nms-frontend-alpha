import inert from '@hapi/inert'

import { health } from '~/src/server/health/index.js'
import { home } from '~/src/server/home/index.js'
import { serveStaticFiles } from '~/src/server/common/helpers/serve-static-files.js'
import { about } from '~/src/server/about/index.js'
import { files } from '~/src/server/files/index.js'
import {
  contacts,
  organizations,
  upload,
  review,
  list
} from './submissions/index.js'
import { redis } from './redis/index.js'

const router = {
  plugin: {
    name: 'router',
    register: async (server) => {
      await server.register([inert])

      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])

      // Application specific routes, add your own routes here
      await server.register([home, about, files])

      // Application submission routes
      await server.register([organizations, contacts, upload, review, list])

      // Redis routes
      await server.register([redis])

      // Static assets
      await server.register([serveStaticFiles])
    }
  }
}

export { router }
