import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {NotFoundError} from 'restify-errors'
import {User} from './users.model'


class UsersRouter extends ModelRouter<User> {

  constructor(){
    super(User)
    this.on('beforeRender', document=>{
      document.password = undefined
      //delete document.password
    })
  }

  findByEmail = (req, resp, next)=>{
    if(req.query.email){
      User.findByEmail(req.query.email)
          .then(user => {
            if(user){
              return [user]
            }else{
              return []
            }
          })
          .then(this.renderAll(resp, next))
          .catch(next)
    }else{
      next()
    }
  }

  applyRoutes(application: restify.Server){

    application.get({path:`${this.basePath}`, version: '2.0.0'}, [this.findByEmail, this.findAll])
    application.get({path:`${this.basePath}`, version: '1.0.0'}, this.findAll)
    application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
    application.post(`${this.basePath}`, this.save)
    application.put(`${this.basePath}/:id`, [this.validateId,this.replace])
    application.patch(`${this.basePath}/:id`, [this.validateId,this.update])
    application.del(`${this.basePath}/:id`, [this.validateId,this.delete])

  }
}

export const usersRouter = new UsersRouter()
