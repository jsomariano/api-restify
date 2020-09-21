import * as mongoose from 'mongoose'
import * as restify from 'restify'

import { environment } from '../common/environment'
import { Router } from '../common/router'


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
      try {
        this.application = restify.createServer({
          name: 'meat-api',
          version: '1.0.0'
        })

        this.application.use(restify.plugins.queryParser())

        routers.forEach(router => router.applyRoutes(this.application))

        this.application.listen(environment.server.port, () => {
          resolve(this.application)
        })

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
}