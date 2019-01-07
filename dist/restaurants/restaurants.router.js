"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
const model_router_1 = require("../common/model-router");
const restaurants_model_1 = require("./restaurants.model");
class RestaurantsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
        // gerar lista menu
        this.findMenu = (req, resp, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id, "+menu").then(rest => {
                //!de indefinido
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                }
                else {
                    //enviar menú na resposta
                    resp.json(rest.menu);
                    return next();
                }
            }).catch(next);
        };
        //atualizar item menu
        this.replaceMenu = (req, resp, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id).then(rest => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                }
                else {
                    rest.menu = req.body; //Array de MenuItem
                    return rest.save();
                }
            }).then(rest => {
                resp.json(rest.menu);
                return next();
            }).catch(next);
        };
    }
    // links menu
    envelope(document) {
        let resource = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }
    applyRoutes(application) {
        // //1 routers, listar a lista de usuário
        // application.get('/restaurants', this.findAll)
        // application.get('/restaurants/:id', [this.validateId, this.findByID]) //this.validateId(retornar erro)
        // application.post('/restaurants', this.save)
        // application.put('/restaurants/:id', [this.validateId, this.replace])
        // application.patch('/restaurants/:id', [this.validateId, this.update])
        // application.del('/restaurants/:id', [this.validateId, this.delete])
        // //registrar as rotas, menu inteiro 
        // application.get('/restaurants/:id/menu', [this.validateId, this.findMenu])
        // //alterar item menu
        // application.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu])
        //links 
        //1 routers, listar a lista de usuário
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findByID]); //this.validateId(retornar erro)
        application.post(`${this.basePath}`, this.save);
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
        //registrar as rotas, menu inteiro 
        application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu]);
        //alterar item menu
        application.put(`${this.basePath}/:id/menu`, [this.validateId, this.replaceMenu]);
    }
}
exports.restaurantsRouter = new RestaurantsRouter();
