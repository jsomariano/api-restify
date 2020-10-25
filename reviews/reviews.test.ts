import 'jest'
import * as request from 'supertest'

const address: string = (<any>global).address
const auth: string = (<any>global).auth

test('get /reviews', () => {
  return request(address)
    .get('/reviews')
    .set('Authorization', auth)
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.items).toBeInstanceOf(Array)
    })
    .catch(fail)
})
