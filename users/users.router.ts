import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { NotFoundError, NotExtendedError } from 'restify-errors'
import {User} from './users.model'

class UsersRouter extends ModelRouter<User> {
    //não enviar password
    constructor (){
        super(User)
        this.on('beforeRender', document =>{
           document.password = undefined 
           //delete document.password
        })
    }

    findByEmail = (req, resp, next) =>{
        //chegar email
        if(req.query.email){
            User.findByEmail( req.query.email )
                .then(user => {
                   if(user){
                      return [user]  
                   }else{
                       return[]
                   }
                } ) //array de documento
                .then(this.renderAll(resp, next))
                .catch(next)
        }else{
            next()
        }
    }

    applyRoutes(application: restify.Server){//método
        
        // application.get({path:'/users', version: '1.0.0'}, this.findAll) //versões API, 1 opção 
        // application.get({path:'/users', version: '2.0.0'},[ this.findByEmail, this.findAll]) //versões API, 2 opção

        // //1 routers, listar a lista de usuário
        // //application.get('/users', this.findAll)
        // application.get('/users/:id', [this.validateId, this.findByID]) //this.validateId(retornar erro)
        // application.post('/users', this.save)
        // application.put('/users/:id', [this.validateId, this.replace])
        // application.patch('/users/:id', [this.validateId, this.update])
        // application.del('/users/:id', [this.validateId, this.delete])

        application.get({path:`${this.basePath}`, version: '1.0.0'}, this.findAll) //versões API, 1 opção 
        application.get({path:`${this.basePath}`, version: '2.0.0'},[ this.findByEmail, this.findAll]) //versões API, 2 opção

        //1 routers, listar a lista de usuário
        //application.get('/users', this.findAll)
        application.get(`${this.basePath}/:id`, [this.validateId, this.findByID]) //this.validateId(retornar erro)
        application.post(`${this.basePath}`, this.save)
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace])
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update])
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete])
    }
}

//associação a método bootstrap
export const usersRouter = new UsersRouter()