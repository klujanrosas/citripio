import fastify from "fastify";

import * as routes from './routes'
import * as models from './models'

const app = fastify({
  logger: true,
})

const log = new models.Log()

routes.configure({  app, logInstance: log, models })

app.listen(3000, function(err, address) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`server listening on ${address}`)
})