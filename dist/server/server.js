"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const environment_1 = require("../common/environment");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./error.handler");
const token_parser_1 = require("../security/token.parser");
//servidor genérrico
class Server {
    //método conexão bd
    initializeDb() {
        mongoose.Promise = global.Promise; //promise nodejs
        return mongoose.connect(environment_1.environment.db.url, {
            useMongoClient: true //new connection 
        });
    }
    //método
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                const restify = require("restify");
                //criar server
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0',
                });
                this.application.use(restify.plugins.queryParser()); //parse de parâmetros na url
                this.application.use(restify.plugins.bodyParser()); //parse body
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                this.application.use(token_parser_1.tokenParser);
                //routers application
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                //routers application
                this.application.listen(environment_1.environment.server.port, () => {
                    // console.log('Api is runnig on http://localhost:3000')
                    resolve(this.application); //conexão ok
                });
                this.application.on('restifyError', error_handler_1.handlerError); //error restify
                // this.application.on('error', (error)) //captura erro, finalizar sem erro
            }
            catch (error) {
                reject(error);
            }
        });
    }
    //array de routers, inicializar conexão com o bd
    bootstrap(routers = []) {
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this)); //retorna a própria instância do servidor
    }
    //desconectar
    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }
}
exports.Server = Server;
