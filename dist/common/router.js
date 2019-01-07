"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const restify_errors_1 = require("restify-errors");
class Router extends events_1.EventEmitter {
    //links API
    envelope(document) {
        return document;
    }
    // links de navegação das páginas
    envelopeAll(documents, options = {}) {
        return documents;
    }
    //otimização de código
    render(response, next) {
        return (document) => {
            if (document) {
                this.emit('beforeRender', document); //não mandar password
                //response.json(document)
                response.json(this.envelope(document));
            }
            else {
                //response.send(404)
                throw new restify_errors_1.NotFoundError('Documento não encontrado!');
            }
            return next();
        };
    }
    //renderAll(response: restify.Response, next: restify.Next){
    renderAll(response, next, options = {}) {
        return (documents) => {
            if (documents) {
                //documents.forEach(document=>{
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document);
                    array[index] = this.envelope(document); // renderizar o array
                });
                //response.json(documents)
                response.json(this.envelopeAll(documents, options)); //links navegação
            }
            else {
                //response.json([])
                response.json(this.envelopeAll([])); //links navegação
            }
            return next();
        };
    }
}
exports.Router = Router;
