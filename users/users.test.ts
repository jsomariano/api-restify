import 'jest'
import * as request from 'supertest'

const address: string = (<any>global).address
const auth: string = (<any>global).auth

test('get /users', ()=>{
  return request(address)
     .get('/users')
     .set('Authorization', auth)
     .then(response=>{
      expect(response.status).toBe(200)
      expect(response.body.items).toBeInstanceOf(Array)
     }).catch(fail)
})

test('post /users', ()=>{
  return request(address)
     .post('/users')
     .set('Authorization', auth)
     .send({
       name: 'usuario1',
       email: 'usuario1@email.com',
       password: '123456',
       cpf: '962.116.531-82'
     })
     .then(response=>{
        expect(response.status).toBe(200)
        expect(response.body._id).toBeDefined()
        expect(response.body.name).toBe('usuario1')
        expect(response.body.email).toBe('usuario1@email.com')
        expect(response.body.cpf).toBe('962.116.531-82')
        expect(response.body.password).toBeUndefined()
     }).catch(fail)
})

test('post /users - nome obrigatorio', ()=>{
  return request(address)
            .post('/users')
            .set('Authorization', auth)
            .send({
              email: 'user12@gmail.com',
              password: '123456',
              cpf: '675.028.852-93'
            })
            .then(response=>{
              expect(response.status).toBe(400)
              expect(response.body.errors).toBeInstanceOf(Array)
              expect(response.body.errors[0].message).toContain('name')
            })
            .catch(fail)
})


/* Primeiro cria-se um novo usuário.
   Depois filtra-se por email na expectativa de retornar apenas
   o que tiver o email identico.
 */
test('get /users - findByEmail', ()=>{
  return request(address)
            .post('/users')
            .set('Authorization', auth)
            .send({
              name: 'usuario 3',
              email: 'usuario3@email.com',
              password: '123456',
            }).then(response => request(address)
                     .get('/users')
                     .set('Authorization', auth)
                     .query({email: 'usuario3@email.com'}))
              .then(response=>{
                       expect(response.status).toBe(200)
                       expect(response.body.items).toBeInstanceOf(Array)
                       expect(response.body.items).toHaveLength(1)
                       expect(response.body.items[0].email).toBe('usuario3@email.com')
             }).catch(fail)
})

test('get /users/aaaaa - not found', ()=>{
  return request(address)
     .get('/users/aaaaa')
     .set('Authorization', auth)
     .then(response=>{
      expect(response.status).toBe(404)
     }).catch(fail)
})

test('get /users/:id', ()=>{
  return request(address)
            .post('/users')
            .set('Authorization', auth)
            .send({
              name: 'usuario 6',
              email: 'user6@gmail.com',
              password: '123456',
              cpf: '482.326.154-27'
            }).then(response => request(address)
                     .get(`/users/${response.body._id}`).set('Authorization', auth))
              .then(response=>{
                       expect(response.status).toBe(200)
                       expect(response.body.name).toBe('usuario 6')
                       expect(response.body.email).toBe('user6@gmail.com')
                       expect(response.body.cpf).toBe('482.326.154-27')
                       expect(response.body.password).toBeUndefined()
           }).catch(fail)
})

test('delete /users/aaaaa - not found', ()=>{
  return request(address)
          .delete(`/users/aaaaa`)
          .set('Authorization', auth)
          .then(response=>{
                expect(response.status).toBe(404)
           }).catch(fail)
})

test('delete /users:/id', ()=>{
  return request(address)
            .post('/users')
            .set('Authorization', auth)
            .send({
              name: 'usuario 3',
              email: 'user3@gmail.com',
              password: '123456',
              cpf: '187.638.581-26'
            }).then(response => request(address)
                     .delete(`/users/${response.body._id}`)
                   .set('Authorization', auth))
              .then(response=>{
                expect(response.status).toBe(204)
           }).catch(fail)

})

test('patch /users/aaaaa - not found', ()=>{
  return request(address)
          .patch(`/users/aaaaa`)
          .set('Authorization', auth)
          .then(response=>{
                expect(response.status).toBe(404)
           }).catch(fail)
})

test('post /users - cpf invalido', ()=>{
  return request(address)
            .post('/users')
            .set('Authorization', auth)
            .send({
              name: 'usuario 12',
              email: 'user12@gmail.com',
              password: '123456',
              cpf: '675.028.222-93'
            })
            .then(response=>{
              expect(response.status).toBe(400)
              expect(response.body.errors).toBeInstanceOf(Array)
              expect(response.body.errors).toHaveLength(1)
              expect(response.body.errors[0].message).toContain('Invalid CPF')
            })
            .catch(fail)
})

test('post /users - email duplicado', ()=>{
  return request(address)
            .post('/users')
            .set('Authorization', auth)
            .send({
              name: 'dupe',
              email: 'dupe@gmail.com',
              password: '123456',
              cpf: '593.436.344-12'
            }).then(response=>
                   request(address)
                      .post('/users')
                      .set('Authorization', auth)
                      .send({
                        name: 'dupe',
                        email: 'dupe@gmail.com',
                        password: '123456',
                        cpf: '593.436.344-12'
                      }))
            .then(response=>{
              expect(response.status).toBe(400)
              expect(response.body.message).toContain('E11000 duplicate key')
            })
            .catch(fail)
})



test('patch /users/:id', ()=>{
  return request(address)
     .post('/users')
     .set('Authorization', auth)
     .send({
       name: 'usuario2',
       email: 'usuario2@email.com',
       password: '123456'
     })
     .then(response => request(address)
                      .patch(`/users/${response.body._id}`)
                      .set('Authorization', auth)
                      .send({
                        name: 'usuario2 - patch'
                      }))
     .then(response=>{
       expect(response.status).toBe(200)
       expect(response.body._id).toBeDefined()
       expect(response.body.name).toBe('usuario2 - patch')
       expect(response.body.email).toBe('usuario2@email.com')
       expect(response.body.password).toBeUndefined()
     })
     .catch(fail)
})

test('put /users/aaaaa - not found', ()=>{
  return request(address)
          .put(`/users/aaaaa`)
          .set('Authorization', auth)
          .then(response=>{
                expect(response.status).toBe(404)
           }).catch(fail)
})

/*
  1. Cria-se um usuario com gender Male
  2. Atualiza, mas nao informa gender
  3. Testa se o documento foi substituido -> gender undefined
*/
test('put /users:/id', ()=>{
  return request(address)
            .post('/users')
            .set('Authorization', auth)
            .send({
              name: 'usuario 7',
              email: 'user7@gmail.com',
              password: '123456',
              cpf: '613.586.318-59',
              gender: 'Male'
            }).then(response => request(address)
                     .put(`/users/${response.body._id}`)
                     .set('Authorization', auth)
                     .send({
                       name: 'usuario 7',
                       email: 'user7@gmail.com',
                       password: '123456',
                       cpf: '613.586.318-59'
                     }))
              .then(response=>{
                       expect(response.status).toBe(200)
                       expect(response.body.name).toBe('usuario 7')
                       expect(response.body.email).toBe('user7@gmail.com')
                       expect(response.body.cpf).toBe('613.586.318-59')
                       expect(response.body.gender).toBeUndefined()
                       expect(response.body.password).toBeUndefined()
            }).catch(fail)

})

test('authenticate user - not authorized', ()=>{
  return request(address)
     .post('/users/authenticate')
     .send({
       email:"admin@email.com",
       password:"123"
     })
     .then(response=>{
        expect(response.status).toBe(403)
     }).catch(fail)
})

test('authenticate user', ()=>{
  return request(address)
     .post('/users/authenticate')
     .send({
       email:"admin@email.com",
       password:"1234567"
     })
     .then(response=>{
        expect(response.status).toBe(200)
        expect(response.body.accessToken).toBeDefined()
     }).catch(fail)
})
