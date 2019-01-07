"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const mongoose = require("mongoose");
const restify_errors_1 = require("restify-errors");
class ModelRouter extends router_1.Router {
    constructor(model) {
        super();
        this.model = model;
        // tamanho da página 
        this.pageSize = 2;
        //validate id
        this.validateId = (req, resp, next) => {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                next(new restify_errors_1.NotFoundError('Document not found'));
            }
            else {
                next();
            }
        };
        this.findAll = (req, resp, next) => {
            let page = parseInt(req.query._page || 1); // saltar de página
            page = page > 0 ? page : 1;
            const skip = (page - 1) * this.pageSize; // pular páginas
            this.model
                .count({}).exec()
                .then(count => this.model.find()
                .skip(skip) // próxima página
                .limit(this.pageSize) // tamanho da página
                .then(this.renderAll(resp, next, {
                page, count, pageSize: this.pageSize, url: req.url
            }))) //paginação) // documento inexistente
                .catch(next); // otimizado, tratamento de erro funcão next
        };
        this.findByID = (req, resp, next) => {
            this.prepareOne(this.model.findById(req.params.id)).then(this.render(resp, next)).catch(next); //otimizado  
        };
        this.save = (req, resp, next) => {
            //criar documento
            let document = new this.model(req.body);
            document.save().then(this.render(resp, next)).catch(next); //otimizado
        };
        this.replace = (req, resp, next) => {
            //três parâmetro filtro(id), body(corpo), promise(pegar resultados)
            const options = { runValidators: true, overwrite: true }; //sobescrever os dados, atualiza os dados completos
            this.model.update({ _id: req.params.id }, req.body, options)
                .exec().then(result => {
                //números de linha atigindas
                if (result.n) {
                    return this.model.findById(req.params.id).exec();
                }
                else {
                    //resp.send(404)//vazio
                    throw new restify_errors_1.NotFoundError('Documento não encontrado!');
                }
            }).then(this.render(resp, next)).catch(next); //otimizado
        };
        this.update = (req, resp, next) => {
            const options = { runValidators: true, new: true }; //return new object
            this.model.findByIdAndUpdate(req.params.id, req.body, options).then(this.render(resp, next)).catch(next); //otimizado
        };
        this.delete = (req, resp, next) => {
            this.model.remove({ _id: req.params.id }).exec().then((cdmResult) => {
                if (cdmResult.result.n) {
                    resp.send(204);
                }
                else {
                    //resp.send(404)
                    throw new restify_errors_1.NotFoundError('Documento não encontrado!');
                }
                return next();
            }).catch(next);
        };
        this.basePath = `/${model.collection.name}`; // rotas
    }
    // preparar query, findById
    prepareOne(query) {
        return query;
    } //retorno o mesmo
    // //findAll
    // protected prepareOne(query: mongoose.DocumentQuery<D[],D[]>) : mongoose.DocumentQuery<D[],D[]>{
    //     return query 
    // }//retorno o mesmo
    //cópia do documento, links
    envelope(document) {
        let resource = Object.assign({ _links: {} }, document.toJSON()); //cópia
        //resource._links.self = `/${this.model.collection.name}/${resource._id}` // adicionar um link
        resource._links.self = `${this.basePath}/${resource._id}`;
        return resource;
    }
    // links de navegação das páginas
    envelopeAll(documents, options = {}) {
        const resource = {
            _links: {
                self: `${options.url}`
            },
            items: documents
        };
        //próximo, anterior, existir documento
        if (options.page && options.count && options.pageSize) {
            //previous 
            if (options.page > 1) {
                resource._links.previous = `${this.basePath}?_page=${options.page - 1}`;
            }
            const remaining = options.count - (options.page * options.pageSize);
            if (remaining > 0) {
                resource._links.next = `${this.basePath}?_page=${options.page + 1}`; //next
            }
        }
        return resource;
    }
}
exports.ModelRouter = ModelRouter;
