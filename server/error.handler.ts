import * as restify from 'restify'

export const handleError = (
  req: restify.Request, res: restify.Response, err, done
) => {

  switch (err.name) {
    case 'MongoError':
      if (err.code === 11000) {
        err.statusCode = 400
      }
    case 'validationError':
      err.statusCode = 400
      break
  }

  done()
}