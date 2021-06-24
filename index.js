import fastify from "fastify";
import sha256 from 'crypto-js/sha256'

const app = fastify({
  logger: true,
})

class LogEntry {
  constructor(prevHash, message, timestamp) {
    this.prevHash = prevHash
    this.message = message
    this.timestamp = timestamp

    this.hash = this.computeHash()
    this.nonce = null;
  }

  computeHash() {
    const hash = sha256(this.prevHash + this.timestamp + this.message + this.nonce)

    return hash.toString()
  }

  toString() {
    return JSON.stringify({
      prevHash: this.prevHash,
      message: this.message,
      timestap: this.timestamp,
      hash: this.hash
    })
  }
}

class Log {
  constructor() {
    const initialEntry = new LogEntry(new Date().toUTCString(), "Hi there, I'm Kenneth", "-")

    this.entries = [initialEntry]
  }
  first() {
    return this.entries[0];
  }
  last() {
    return this.entries[this.entries.length - 1]
  }
  /**
   * @param {LogEntry} entry 
   */
  write(entry) {
    // TODO: add entry linking here
    // get previous hash
    // calculate nonce 
    this.entries.push(entry)
  }
  // TODO: IoC this one so we can snapshot when test flushing
  flush() {
    // TODO: periodically write to file and empty from memory
  }
}

const log = new Log()

// TODO: move route config out
app.route({
  method: 'GET',
  url: '/',
  handler(request, reply) {
    reply.send(log.entries)
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
      const entry = new LogEntry(log.last().hash, request.body.message, new Date().toUTCString())
      log.write(entry)
      reply.status(200).send(entry.toString())
    } catch(e) {
      reply.status(500).send()
    }
  }
})

app.listen(3000, function(err, address) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`server listening on ${address}`)
})