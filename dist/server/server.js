"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const mongoose = require("mongoose");
const environment_1 = require("../common/environment");
const logger_1 = require("../common/logger");
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
                const options = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0',
                    log: logger_1.logger // instância do logger do bayner 
                });
                if (environment_1.environment.security.enableHTTPS) {
                    options.certificate = fs.readFileSync(environment_1.environment.security.certificate),
                        options.key = fs.readFileSync(environment_1.environment.security.key);
                }
                this.application = restify.createServer(options);
                this.application.pre(restify.plugins.requestLogger({
                    log: logger_1.logger //log especifico
                }));
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
                // (req, resp, route, error)
                /* this.application.on('after', restify.plugins.auditLogger({
                     log: logger,
                     event: 'after', // imprimir informações no console
                     server: this.application
                 })) //log
 
                 this.application.on('audit', data=>[
 
                 ])*/
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
