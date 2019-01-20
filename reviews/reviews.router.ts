import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { ModelRouter } from '../common/model-router' 
import { Review } from './reviews.model'
import {authorize} from '../security/authz.handler'

class ReviewsRouter extends ModelRouter<Review> {
    constructor (){
        super(Review)
    }

    //2 opção
     // preparar query
     protected prepareOne(query: mongoose.DocumentQuery<Review,Review>) : mongoose.DocumentQuery<Review,Review>{
        return query.populate('user', 'name')
                    .populate('restaurant', 'name')
    }//retorno o mesmo

    // links menu
    envelope(document){
        let resource = super.envelope(document)
        const restId = document.restaurant._id ? document.restaurant._id : document.restaurant // buscar _id restaurants
        resource._links.restaurant = `/restaurants/${restId}` // links
        return resource
    }

    // 1 opção
    // findByID = (req, resp, next)=>{
    //     //popular user(name), restaurants
    //     this.model.findById(req.params.id)
    //         .populate('user', 'name')
    //         .populate('restaurant', 'name')
    //         .then(this.render(resp, next))
    //         .catch(next) //otimizado  
    // }

    applyRoutes(application: restify.Server){//método
        //1 routers, listar a lista de usuário
        // application.get('/reviews', this.findAll)
        // application.get('/reviews/:id', [this.validateId, this.findByID]) //this.validateId(retornar erro)
        // application.post('/reviews', this.save)
        // // application.put('/reviews/:id', [this.validateId, this.replace])
        // // application.patch('/reviews/:id', [this.validateId, this.update])
        // // application.del('/reviews/:id', [this.validateId, this.delete])
         //links routers

        application.get(`${this.basePath}`, this.findAll)
        application.get(`${this.basePath}/:id`, [this.validateId, this.findByID]) //this.validateId(retornar erro)
        application.post(`${this.basePath}`, [authorize('user'), this.save])
    }
}
export const reviewsRouter = new ReviewsRouter()
