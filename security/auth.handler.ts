import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import { environment } from '../common/environment'
import { NotAuthorizedError } from 'restify-errors'
import { User } from '../users/users.model'

export const authenticate: restify.RequestHandler = (req, res, next) => {
  const { email, password } = req.body
  User.findByEmail(email, "+password")
    .then(user => {
      if (user && user.matches(password)) {
        const token = jwt.sign(
          {
            sub: user.email,
            iss: 'meat-api'
          },
          environment.security.apiSecret
        )
        res.json({
          name: user.name,
          email: user.email,
          accessToken: token,
        })

        return next()
      } else {
        return next(new NotAuthorizedError('Invalid Credentials'))
      }
    }).catch(next)
}