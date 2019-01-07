import * as restify from 'restify'
import { EventEmitter } from 'events';
import { NotFoundError } from 'restify-errors';

export abstract class Router extends EventEmitter {
    abstract applyRoutes(application: restify.Server)//recebe instância do servidor restify

    //links API
    envelope(document : any) : any {
        return document
    }

    // links de navegação das páginas
    envelopeAll(documents: any[], options: any = {}): any {
        return documents
    }

    //otimização de código
    render(response: restify.Response, next: restify.Next ){
        return (document)=>{
            if(document){
                this.emit('beforeRender', document)//não mandar password
                //response.json(document)
                response.json(this.envelope(document))
            }else{
              //response.send(404)
              throw new NotFoundError('Documento não encontrado!')  
            } 
            return next()
        }
    }

    //renderAll(response: restify.Response, next: restify.Next){
    renderAll(response: restify.Response, next: restify.Next , options: any = {}){ //paginação
        return (documents: any[]) =>{
            if(documents){
                //documents.forEach(document=>{
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document)
                    array[index] = this.envelope(document) // renderizar o array
                })
                //response.json(documents)
                response.json(this.envelopeAll(documents, options)) //links navegação
            }else{
                //response.json([])
                response.json(this.envelopeAll([])) //links navegação
            }
            return  next()
        }
    }
}