const express = require('express'); //Framewordk da aplicação
const cors = require('cors'); //biblioteva utilizada para inserir headers http
const { connection } = require('./database/connection'); //conexão com o banco de dados
const routes = require('./routes'); //rotas da aplicação

class Server {
    constructor(server = express()) //Argumento do construtor auto iniciado da aplicação para usarmos as devidas funções do express
    {
        this.middlewares(server);//Intância do argumento da função para a função do middleware
        this.database();//Intância do argumento da função para a função do banco de dados
        this.allRoutes(server);
        this.initializeServer(server);//Intância do argumento da função para a função de inicialização do servidor
    }

    async middlewares(app) {
        app.use(cors());//Utilização da função cors para inserir os headers http
        app.use(express.json());//Habilitar entrada de dados como json no servidor
    }

    async database() {
        try {
            await connection.authenticate();//Autenticação com o banco de dados
            console.log('Conexão bem sucessida!');
        } catch (error) {
            console.log('Erro ao conectar com o banco de dados: ', error);
            throw error;
        }
    }

    async initializeServer(app) {
        const PORT = 3333;//Porta de acesso ao servidor
        app.listen(PORT, () =>
            console.log(`Servidor rodando na porta ${PORT}`));//Inicialização do servidor
    }

    async allRoutes(app) {
        app.use(routes);
    }
}

module.exports = { Server }; //Exportação da classe para utilização em outros arquivos
