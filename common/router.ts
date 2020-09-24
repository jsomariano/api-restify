import * as restify from 'restify'
import { EventEmitter } from 'events'

export abstract class Router extends EventEmitter {
  abstract applyRoutes(application: restify.Server)

  render(response: restify.Response, next: restify.Next) {
    return (document) => {
      if (document) {
        this.emit('beforeRender', document)
        response.json(document)
      } else {
        response.send(404)
      }
      return next()
    }
  }
}