const { INTEGER, DECIMAL, DATE, ARRAY } = require('sequelize');
const sequelize = require('../config/database.config');
const { connection } = require('../database/connection');
const { Pedido } = require('./pedido');
const { PedidoProduto } = require('./pedidosProdutos');


const Carrinho = connection.define('carrinho', {
    usuarioId: {
        type: INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id',
        },
    },
    vendedorId: {
        type: INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id',
        },
    },
    produtoId: {
        type: ARRAY(INTEGER), // Para armazenar vários IDs de produtos
        allowNull: false,
        references: {
            model: {
                tableName: 'produtos'
            },
            key: 'id'
        }
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

// Adicione os relacionamentos
Carrinho.belongsTo(Pedido, { foreignKey: 'pedidoId' });
Carrinho.hasMany(PedidoProduto, { foreignKey: 'carrinhoId' });

module.exports = { Carrinho, Pedido, PedidoProduto };