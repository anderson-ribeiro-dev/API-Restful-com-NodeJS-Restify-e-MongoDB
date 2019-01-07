"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
//valor content type
const mpContentType = 'application/merge-patch+json';
//function
exports.mergePatchBodyParser = (req, resp, next) => {
    if (req.getContentType() == mpContentType && req.method === 'PATCH') {
        req.rawBody = req.body; //guardar o parseBody
        try {
            req.body = JSON.parse(req.body); // transformar js
        }
        catch (e) {
            return next(new restify_errors_1.BadRequestError(`Invalid content: ${e.message}`)); //error the bad
        }
    }
    return next();
};
