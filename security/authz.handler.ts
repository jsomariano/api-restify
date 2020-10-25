import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import { environment } from '../common/environment'
import { ForbiddenError } from 'restify-errors'
import { User } from '../users/users.model'


export const authorize: (...profiles: string[]) => restify.RequestHandler = (...profiles) => {
  return (req, resp, next) => {
    if (req.authenticated !== undefined && req.authenticated.hasAny(...profiles)) {
      next()
    } else {
      next(new ForbiddenError('Permission denied'))
    }
  }
}