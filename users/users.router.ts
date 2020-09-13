import { Router } from '../common/router'
import * as restify from 'restify'
import { User } from './users.model'

class UsersRouter extends Router {
  applyRoutes(application: restify.Server) {

    application.get('/users', (req, res, next) => {
      User.findAll()
        .then(users => {
          res.json(users)
          return next()
        })
    })

    application.get('/users/:userId', (req, res, next) => {
      User.findById(req.params.userId)
        .then(user => {
          if (user) {
            res.json(user)
            return next()
          }
          res.send(404)
          return next()
        })
    })

  }
}

export const usersRouter = new UsersRouter()