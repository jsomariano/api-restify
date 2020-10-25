import * as fs from 'fs'

import * as mongoose from 'mongoose'
import * as restify from 'restify'

import { environment } from '../common/environment'
import { Router } from '../common/router'
import { mergePatchBodyParser } from './merge-patch.parser'
import { handleError } from './error.handler'

import { tokenParser } from '../security/token.parser'

export class Server {

  application: restify.Server

  initializeDb() {
    return mongoose.connect(environment.db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const options: restify.ServerOptions = {
        name: 'meat-api',
        version: '1.0.0',
      }

      if (environment.security.enableHTTPS) {
        options.certificate = fs.readFileSync(environment.security.certificate)
        options.key = fs.readFileSync(environment.security.key)
      }

      try {
        this.application = restify.createServer(options)

        this.application.use(restify.plugins.queryParser())
        this.application.use(restify.plugins.bodyParser())
        this.application.use(mergePatchBodyParser)
        this.application.use(tokenParser)

        routers.forEach(router => router.applyRoutes(this.application))

        this.application.listen(environment.server.port, () => {
          resolve(this.application)
        })

        this.application.on('restifyError', handleError)

      } catch (ex) {
        reject(ex)
      }
    })
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initializeDb().then(() => (
      this.initRoutes(routers)
        .then(() => this)
    ))
  }

  shutdown() {
    return mongoose.disconnect().then(() => {
      this.application.close()
    })
  }

}