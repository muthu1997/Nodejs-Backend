import http from 'http'
import { env, mongo, port, ip } from './config'
import mongoose from './services/mongoose'
import express from './services/express'
import api from './api'
import {sendreport} from './api/reportEmail'

const app = express(api)
const server = http.createServer(app)

mongoose.connect(mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise
sendreport()
const io = require('socket.io')(server);

export const emitMessage = (pattern, message) => {
  io.emit(pattern, message);
}
console.log(process.argv);
if (process.argv && process.argv.indexOf('CRON') >= 0) {
  console.log(`CROM job started looking for schduled jobs`)
} else {
  setImmediate(() => {
    server.listen(port, ip, () => {
      console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
    })
  })
}
export default app