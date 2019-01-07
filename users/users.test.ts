import { User } from './users.model';
import { usersRouter } from './users.router';
import { environment } from './../common/environment';
import { Server } from './../server/server';
import 'jest'
import * as request from 'supertest'
import { response } from 'spdy';

//only - executa o teste
//skip - pula o teste

 let address: string = (<any>global).address
// // servidor para teste
// let server: Server
// // roda antes do teste
// beforeAll(()=>{
//     environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
//     environment.server.port = process.env.SERVER_PORT || 3001
//     address = `http://localhost:${environment.server.port}`
//     server = new Server()
//     return server.bootstrap([usersRouter])
//                  .then(()=> User.remove({}).exec())// remover os dados 
//                  .catch(console.error)

// })

test('get /users', ()=>{
    // console.log("Estou testando")
     return request(address)
            .get('/users')
            .then(response => {
                expect(response.status).toBe(200) //objeto esperando no corpo da resposta
                expect(response.body.items).toBeInstanceOf(Array)
            }).catch(fail)
})



test('post / users', ()=>{
    return request(address)
    .post('/users')
    .send({ //corpo requisição
        name: 'usuario1',
        email: 'usuario1@email.com',
        password: '123456',
        cpf: '77314717486'
    })
    .then(response => {
        expect(response.status).toBe(200) //objeto esperando no corpo da resposta
        expect(response.body._id).toBeDefined()
        expect(response.body.name).toBe('usuario1')
        expect(response.body.email).toBe('usuario1@email.com')
        expect(response.body.cpf).toBe('77314717486')
        expect(response.body.password).toBeUndefined()
    }).catch(fail)
});

// teste para notfound
test('get / users/aaaaa - not found', () =>{
    return request(address)
    .get('/users/aaaaa')
    .then(response => {
        expect(response.status).toBe(404) //objeto esperando no corpo da resposta
    }).catch(fail)
})

test('patch / users/:id', ()=>{
    return request(address)
    .post('/users')
    .send({ //corpo requisição
        name: 'usuario2',
        email: 'usuario2@email.com',
        password: '123456',
    })
    .then(response => request(address)
                      .patch(`/users/${response.body._id}`)
                      .send({
                          name: 'usuario2 - patch'
                      }))
    .then(response =>{
        expect(response.status).toBe(200) //objeto esperando no corpo da resposta
        expect(response.body._id).toBeDefined()
        expect(response.body.name).toBe('usuario2 - patch')
        expect(response.body.email).toBe('usuario2@email.com')
        expect(response.body.password).toBeUndefined()
    })                  
    .catch(fail)
})

//// rodar após o teste
// afterAll(()=>{
//     return server.shutdown()
// })


