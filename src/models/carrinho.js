const { INTEGER, DECIMAL, DATE } = require('sequelize');
const sequelize = require('../config/database.config');
const { connection } = require('../database/connection');

const Carrinho = connection.define('carrinho', {
    id: {
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    produtoId: {
        type: INTEGER,
        allowNull: false,
        references: {
            model: 'produtos',
            key: 'id',
        },
    },
    quantidade: {
        type: INTEGER,
        allowNull: false,
    },
    valorTotal: {
        type: DECIMAL(10, 2),
        allowNull: false,
    },
    createdAt: DATE,
    updatedAt: DATE,
},
    { underscored: true, paranoid: true }
);

module.exports = { Carrinho };