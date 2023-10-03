const { Sequelize } = require('sequelize');//Importação do Sequelize para utilização de seus métodos
const databaseConfig = require('../config/database.config');//Importação das configurações do banco de dados

const connection = new Sequelize(databaseConfig);//Criação da conexão com o banco de dados

module.exports = { connection }; //Exportação da conexão para utilização em outros arquivos