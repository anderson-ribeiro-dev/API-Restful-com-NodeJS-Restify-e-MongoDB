import { Router } from './router'
import * as mongoose from 'mongoose' 
import { NotFoundError } from 'restify-errors'

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
   //links rotas 
   basePath: string 

   // tamanho da página 
   pageSize: number = 2

    constructor(protected model: mongoose.Model<D>){
        super()
        this.basePath = `/${model.collection.name}` // rotas
    }
    // preparar query, findById
    protected prepareOne(query: mongoose.DocumentQuery<D,D>) : mongoose.DocumentQuery<D,D>{
        return query 
    }//retorno o mesmo

    // //findAll
    // protected prepareOne(query: mongoose.DocumentQuery<D[],D[]>) : mongoose.DocumentQuery<D[],D[]>{
    //     return query 
    // }//retorno o mesmo

    //cópia do documento, links
    envelope(document : any) : any {
        let resource = Object.assign({_links:{}}, document.toJSON()) //cópia
        //resource._links.self = `/${this.model.collection.name}/${resource._id}` // adicionar um link
        resource._links.self = `${this.basePath}/${resource._id}`
        return resource
    }

     // links de navegação das páginas
     envelopeAll(documents: any[], options: any = {}): any {
        const  resource: any = {
            _links: {
                self: `${options.url}`
            },
            items: documents 
        }

        //próximo, anterior, existir documento
        if(options.page && options.count && options.pageSize){
            //previous 
            if(options.page > 1){
                resource._links.previous = `${this.basePath}?_page=${options.page - 1}`    
            }
                const remaining = options.count - (options.page * options.pageSize)
                if(remaining > 0){
                    resource._links.next = `${this.basePath}?_page=${options.page + 1}` //next
                }    
        }
        return resource
    }

    //validate id
    validateId = (req, resp, next) =>{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            next(new NotFoundError('Document not found'))
        }else{
            next()
        }
    } 

    findAll =  (req, resp, next)=>{
        let page = parseInt(req.query._page || 1) // saltar de página
        page = page > 0 ? page : 1
        const skip = (page -1 ) * this.pageSize// pular páginas

         this.model
             .count({}).exec()
             .then(count =>  this.model.find()
                .skip(skip) // próxima página
                .limit(this.pageSize) // tamanho da página
                .then(this.renderAll(resp, next, {
                    page, count, pageSize: this.pageSize, url: req.url
                }
                ))) //paginação) // documento inexistente
             .catch(next) // otimizado, tratamento de erro funcão next
    }

    findByID = (req, resp, next)=>{
       this.prepareOne(this.model.findById(req.params.id)).then(this.render(resp, next)).catch(next) //otimizado  
    }
 
    save = (req, resp, next)=>{
        //criar documento
        let document = new this.model(req.body)
        document.save().then(this.render(resp, next)).catch(next) //otimizado
    }

    replace = (req, resp, next)=>{
        //três parâmetro filtro(id), body(corpo), promise(pegar resultados)
        const options = { runValidators: true, overwrite: true} //sobescrever os dados, atualiza os dados completos
        this.model.update({_id: req.params.id}, req.body, options)
            .exec().then(result =>{
                //números de linha atigindas
                if(result.n){
                    return this.model.findById(req.params.id).exec()
                }else{
                    //resp.send(404)//vazio
                    throw new NotFoundError('Documento não encontrado!')
                }
        
            }).then(this.render(resp, next)).catch(next) //otimizado
        }

        update = (req, resp, next)=>{
            const options = { runValidators: true, new : true}    //return new object
            this.model.findByIdAndUpdate(req.params.id, req.body, options).then(this.render(resp, next)).catch(next) //otimizado
        }

        delete =  (req, resp, next) =>{
            this.model.remove({_id:req.params.id}).exec().then((cdmResult: any) =>{
                if(cdmResult.result.n){
                    resp.send(204)
                }else{
                    //resp.send(404)
                    throw new NotFoundError('Documento não encontrado!')
                }
                    return next()
            }).catch(next)
        }
}