import 'jest'
import * as request from 'supertest'
import { Server } from '../server/server'
import { environment } from '../common/environment'
import { usersRouter } from './users.router'
import { User } from './users.model'

let address: string = (<any>global).address

test('get /users', () => {
  return request(address)
    .get('/users')
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.items).toBeInstanceOf(Array)
    })
    .catch(fail)
})

test('post /users', () => {
  return request(address)
    .post('/users')
    .send({
      name: "Usuario Teste",
      email: "usuario_test@email.com",
      password: "12345678",
      cpf: '202.109.230-59'
    })
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body._id).toBeDefined()
      expect(response.body.name).toBe("Usuario Teste")
      expect(response.body.email).toBe("usuario_test@email.com")
      expect(response.body.cpf).toBe("202.109.230-59")
      expect(response.body.password).toBeUndefined()
    })
    .catch(fail)
})

test('get /users/aaaaa - not found', () => {
  return request(address)
    .get('/users/aaaaa')
    .then(response => {
      expect(response.status).toBe(404)
    })
    .catch(fail)
})

test('patch /users/:id', () => {
  return request(address)
    .post('/users')
    .send({
      name: "Usuario teste alterado",
      email: "usuario_test_alterado@email.com",
      password: "12345678",
    })
    .then(response => {
      request(address)
        .patch(`/users/${response.body._id}`)
        .send({
          name: "Usuario teste alterado patch",
        })
        .then(response => {
          expect(response.status).toBe(200)
          expect(response.body._id).toBeDefined()
          expect(response.body.name).toBe("Usuario teste alterado patch")
          expect(response.body.email).toBe("usuario_test_alterado@email.com")
          expect(response.body.password).toBeUndefined()
        })
    })
    .catch(fail)
})
