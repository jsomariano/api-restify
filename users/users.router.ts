import { Router } from '../common/router'
import * as restify from 'restify'
import { User } from './users.model'

class UsersRouter extends Router {

  constructor() {
    super()

    this.on('beforeRender', document => {
      document.password = undefined
    })
  }

  applyRoutes(application: restify.Server) {

    application.get('/users', (req, res, next) => {
      User.find()
        .then(this.render(res, next))
    })

    application.get('/users/:userId', (req, res, next) => {
      User.findById(req.params.userId)
        .then(this.render(res, next))
    })

    application.post('/users', (req, res, next) => {
      let user = new User(req.body)
      user.save().then(this.render(res, next))
    })

    application.put('/users/:userId', (req, res, next) => {
      const options = { overwrite: true }
      User.update({ _id: req.params.userId }, req.body, options)
        .exec()
        .then(result => {
          if (result.n) {
            return User.findById(req.params.userId)
          } else {
            res.send(404)
          }
        }).then(this.render(res, next))
    })

    application.patch('/users/:userId', (req, res, next) => {
      const options = { new: true }
      User.findByIdAndUpdate(req.params.userId, req.body, options)
        .then(this.render(res, next))
    })

    application.del('/users/:userId', (req, res, next) => {
      User.remove({ _id: req.params.userId })
        .exec()
        .then((cmdResult: any) => {
          if (cmdResult.n) {
            res.send(204)
            return next()
          } else {
            res.send(404)
          }
          return next()
        })
    })

  }
}

export const usersRouter = new UsersRouter()