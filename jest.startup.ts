import * as jestCli from 'jest-cli'

import {Server} from './server/server'
import {environment} from './common/environment'
import {usersRouter} from './users/users.router'
import {reviewsRouter} from './reviews/reviews.router'
import {restaurantsRouter} from './restaurants/restaurants.router'
import {User} from './users/users.model'
import {Review} from './reviews/reviews.model'
import {Restaurant} from './restaurants/restaurants.model'

let server: Server
const beforeAllTests = ()=>{
  environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
  environment.server.port = process.env.SERVER_PORT || 3001
  server = new Server()
  return server.bootstrap([
    usersRouter,
    reviewsRouter,
    restaurantsRouter
  ])
  .then(()=>User.remove({}).exec())
  .then(()=>{
    let admin = new User()
    admin.name = 'admin'
    admin.email = 'admin@email.com'
    admin.password = '1234567'
    admin.profiles = ['admin', 'user']
    return admin.save()
  })
  .then(()=>Review.remove({}).exec())
  .then(()=>Restaurant.remove({}).exec())
}

const afterAllTests = ()=>{
  return server.shutdown()
}

beforeAllTests()
.then(()=>jestCli.run())
.then(()=>afterAllTests())
.catch(error=>{
  console.error(error)
  process.exit(1)
})
