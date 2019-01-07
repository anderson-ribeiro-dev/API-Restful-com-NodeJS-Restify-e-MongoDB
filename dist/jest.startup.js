"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jestCli = require("jest-cli");
const users_model_1 = require("./users/users.model");
const users_router_1 = require("./users/users.router");
const environment_1 = require("./common/environment");
const server_1 = require("./server/server");
const reviews_router_1 = require("./reviews/reviews.router");
const reviews_model_1 = require("./reviews/reviews.model");
// servidor para teste
let server;
const beforeAllTests = () => {
    environment_1.environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db';
    environment_1.environment.server.port = process.env.SERVER_PORT || 3001;
    server = new server_1.Server();
    return server.bootstrap([
        users_router_1.usersRouter,
        reviews_router_1.reviewsRouter
    ])
        .then(() => users_model_1.User.remove({}).exec()) // remover os dados 
        .then(() => reviews_model_1.Review.remove({}).exec()); // remover os dados 
};
const afterAttTests = () => {
    return server.shutdown();
};
// configurações básicas, inicializar o servidor
beforeAllTests()
    .then(() => jestCli.run()) // start jest 
    .then(() => afterAttTests())
    .catch(console.error); // erro
