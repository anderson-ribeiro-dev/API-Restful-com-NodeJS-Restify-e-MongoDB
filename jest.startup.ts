import * as jestCli from 'jest-cli'


import { User } from './users/users.model'
import { usersRouter } from './users/users.router'
import { environment } from './common/environment'
import { Server } from './server/server'
import { reviewsRouter } from './reviews/reviews.router'
import { Review } from './reviews/reviews.model'

// servidor para teste
let server: Server

const beforeAllTests = ()=>{
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
    environment.server.port = process.env.SERVER_PORT || 3001
    server = new Server()
    return server.bootstrap([
        usersRouter,
        reviewsRouter
    ])
    .then(()=> User.remove({}).exec())// remover os dados 
    .then(()=> Review.remove({}).exec())// remover os dados 
}

const afterAttTests = ()=>{
    return server.shutdown()
}

// configurações básicas, inicializar o servidor
beforeAllTests()
.then(()=>jestCli.run()) // start jest 
.then(()=>afterAttTests())
.catch(console.error) // erro