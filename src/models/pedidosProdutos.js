const { INTEGER } = require('sequelize');
const { connection } = require('../database/connection');

const PedidoProduto = connection.define('pedidoProduto', {
    pedido_id: {
        type: INTEGER,
        allowNull: false,
        references: {
            model: {
                tableName: 'pedidos',
            },
            key: 'id',
        },
    },
    produto_id: {
        type: INTEGER,
        allowNull: false,
        references: {
            model: {
                tableName: 'produtos',
            },
            key: 'id',
        },
    },
});

module.exports = { PedidoProduto };