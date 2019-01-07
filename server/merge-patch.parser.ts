import * as  restify from 'restify'
import { BadRequestError } from 'restify-errors'

//valor content type
const mpContentType = 'application/merge-patch+json'

//function
export const mergePatchBodyParser = (req: restify.Request, resp: restify.Response, next) => {
    if(req.getContentType() == mpContentType && req.method === 'PATCH'){
        (<any>req).rawBody = req.body //guardar o parseBody
        try {
            req.body = JSON.parse(req.body) // transformar js
        } catch (e) {
            return next(new BadRequestError(`Invalid content: ${e.message}`))//error the bad
        }
        
    }
    return next()
}