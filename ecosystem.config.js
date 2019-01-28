module.exports = {
  apps : [{
    name   : "meat-api",
    script : "./dist/main.js",
    instances: 0, //número  de instâncias 
    exec_mode: 'cluster', // processo master ouvinte e faz o balanceamento para os outros
    watch: true,
    merge_logs: true, // juntar logs
    env: { // variável de ambiente
      SERVER_PORT: 5000,
      DB_URL: 'mongodb://localhost/meat-api',
      NODE_ENV: 'development'
    },
    env_production: {
      SERVER_PORT: 5001,
      NODE_ENV: 'production'
    }
  }]
}
