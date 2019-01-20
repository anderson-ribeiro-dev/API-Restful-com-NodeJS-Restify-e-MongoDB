"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const users_model_1 = require("./users.model");
const auth_handler_1 = require("../security/auth.handler");
const authz_handler_1 = require("../security/authz.handler");
class UsersRouter extends model_router_1.ModelRouter {
    //não enviar password
    constructor() {
        super(users_model_1.User);
        this.findByEmail = (req, resp, next) => {
            //chegar email
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email)
                    .then(user => {
                    if (user) {
                        return [user];
                    }
                    else {
                        return [];
                    }
                }) //array de documento
                    .then(this.renderAll(resp, next))
                    .catch(next);
            }
            else {
                next();
            }
        };
        this.on('beforeRender', document => {
            document.password = undefined;
            //delete document.password
        });
    }
    applyRoutes(application) {
        // application.get({path:'/users', version: '1.0.0'}, this.findAll) //versões API, 1 opção 
        // application.get({path:'/users', version: '2.0.0'},[ this.findByEmail, this.findAll]) //versões API, 2 opção
        // //1 routers, listar a lista de usuário
        // //application.get('/users', this.findAll)
        // application.get('/users/:id', [this.validateId, this.findByID]) //this.validateId(retornar erro)
        // application.post('/users', this.save)
        // application.put('/users/:id', [this.validateId, this.replace])
        // application.patch('/users/:id', [this.validateId, this.update])
        // application.del('/users/:id', [this.validateId, this.delete])
        application.get({ path: `${this.basePath}`, version: '1.0.0' }, [authz_handler_1.authorize('admin'), this.findAll]); //versões API, 1 opção 
        application.get({ path: `${this.basePath}`, version: '2.0.0' }, [authz_handler_1.authorize('admin'), this.findByEmail, this.findAll]); //versões API, 2 opção
        //1 routers, listar a lista de usuário
        //application.get('/users', this.findAll)
        application.get(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.findByID]); //this.validateId(retornar erro)
        application.post(`${this.basePath}`, [authz_handler_1.authorize('admin'), this.save]);
        application.put(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.delete]);
        application.post(`${this.basePath}/authenticate`, auth_handler_1.authenticate);
    }
}
//associação a método bootstrap
exports.usersRouter = new UsersRouter();
