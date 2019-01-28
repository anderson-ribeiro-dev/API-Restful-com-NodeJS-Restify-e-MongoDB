"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
const bunyan = require("bunyan");
exports.logger = bunyan.createLogger({
    name: environment_1.environment.log.name,
    level: bunyan.resolveLevel(environment_1.environment.log.level)
});
