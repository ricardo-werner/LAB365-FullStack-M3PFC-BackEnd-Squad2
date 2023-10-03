const { config } = require('dotenv');
config();

module.exports = {
    dialect: process.env.DIALECT,// Dialect é o tipo de banco de dados que será utilizado
    host: process.env.HOST, //Host é o endereço do banco de dados
    username: process.env.USERNAMEDB, //Username é o nome do usuário do banco de dados
    password: process.env.PASSWORDDB, //Password é a senha do usuário do banco de dados
    database: process.env.DATABASE, //Database é o nome do banco de dados
    port: process.env.PORT, //Port é a porta de acesso ao banco de dados
    secret_key: process.env.SECRET_KEY_JWT, //Secret_key é a chave secreta para criptografia de dados
    define: {
        underscored: true,
        underscoredAll: true,
    },
};