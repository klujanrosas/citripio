import { getUTCDate } from "./utils"

export function configure({
  app, logInstance, models: { LogEntry }
}) {
  app.route({
    method: 'GET',
    url: '/',
    handler(request, reply) {
      reply.send(logInstance.entries)
    }
  })
  app.route({
    method: 'POST',
    url: '/citripio',
    schema: {
      message: {
        type: 'string',
      }
    },
    // TODO: IoC this for testing
    handler(request, reply) {
      try {
        const entry = new LogEntry({
          message: request.body.message,
          timestamp: getUTCDate()
        })
        logInstance.write(entry)
        reply.status(200).send(entry.toString())
      } catch(e) {
        console.log(e)
        reply.status(500).send()
      }
    }
  })
}