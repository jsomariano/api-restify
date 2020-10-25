import * as fs from 'fs'

import * as restify from 'restify'
import * as mongoose from 'mongoose'
import * as corsMiddleware from 'restify-cors-middleware'

import {environment} from '../common/environment'
import {logger} from '../common/logger'
import {Router} from '../common/router'
import {mergePatchBodyParser} from './merge-patch.parser'
import {handleError} from './error.handler'

import {tokenParser} from '../security/token.parser'

export class Server {

  application: restify.Server

  initializeDb(): mongoose.MongooseThenable {
    (<any>mongoose).Promise = global.Promise
    return mongoose.connect(environment.db.url, {
      useMongoClient: true
    })
  }

  initRoutes(routers: Router[]): Promise<any>{
    return new Promise((resolve, reject)=>{
      try{

        const options: restify.ServerOptions = {
          name: 'meat-api',
          version: '1.0.0',
          log: logger
        }
        if(environment.security.enableHTTPS){
          options.certificate = fs.readFileSync(environment.security.certificate),
          options.key = fs.readFileSync(environment.security.key)
        }

        this.application = restify.createServer(options)

        const corsOptions: corsMiddleware.Options = {
          preflightMaxAge: 86400,
          origins: ['*'],
          allowHeaders: ['authorization'],
          exposeHeaders: ['x-custom-header']
        }
        const cors: corsMiddleware.CorsMiddleware = corsMiddleware(corsOptions)

        this.application.pre(cors.preflight)

        this.application.pre(restify.plugins.requestLogger({
          log: logger
        }))

        this.application.use(cors.actual)
        this.application.use(restify.plugins.queryParser())
        this.application.use(restify.plugins.bodyParser())
        this.application.use(mergePatchBodyParser)
        this.application.use(tokenParser)

        //routes
        for (let router of routers) {
          router.applyRoutes(this.application)
        }

        this.application.listen(environment.server.port, ()=>{
           resolve(this.application)
        })

        this.application.on('restifyError', handleError)
        //(req, resp, route, error)
        /*this.application.on('after', restify.plugins.auditLogger({
          log: logger,
          event: 'after',
          server: this.application
        }))

        this.application.on('audit', data=>{

        })*/

      }catch(error){
        reject(error)
      }
    })
  }

  bootstrap(routers: Router[] = []): Promise<Server>{
      return this.initializeDb().then(()=>
             this.initRoutes(routers).then(()=> this))
  }

  shutdown(){
    return mongoose.disconnect().then(()=>this.application.close())
  }

}
