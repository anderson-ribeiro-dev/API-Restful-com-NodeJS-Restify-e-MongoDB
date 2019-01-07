import { reviewsRouter } from './reviews/reviews.router';
import { restaurantsRouter } from './restaurants/restaurants.router';
import { Server } from './server/server'
import { usersRouter } from './users/users.router'


const server = new Server()
//instñcia do routers no array, para applyRouters
server.bootstrap([usersRouter , restaurantsRouter, reviewsRouter]).then(server =>{
    console.log('Server is listening on:', server.application.address())
}).catch(error =>{
    console.log('Server failed to start')
    console.error(error)
    process.exit(1)//saida anormal
})

