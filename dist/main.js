"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reviews_router_1 = require("./reviews/reviews.router");
const restaurants_router_1 = require("./restaurants/restaurants.router");
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const server = new server_1.Server();
//instñcia do routers no array, para applyRouters
server.bootstrap([users_router_1.usersRouter, restaurants_router_1.restaurantsRouter, reviews_router_1.reviewsRouter]).then(server => {
    console.log('Server is listening on:', server.application.address());
}).catch(error => {
    console.log('Server failed to start');
    console.error(error);
    process.exit(1); //saida anormal
});
