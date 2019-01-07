export const environment ={
    server: {port: process.env.SERVER_PORT || 3000 },//variável de ambiente
    db: {url: process.env.DB_URL || 'mongodb://localhost/meat-api'},// url db
    security: { saltRounds: process.env.SALT_ROUNDS || 10} //numbers out setRounds
}