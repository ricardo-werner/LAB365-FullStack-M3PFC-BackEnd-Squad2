const { INTEGER, DECIMAL, DATE } = require('sequelize');
const { connection } = require('../database/connection');
const { Usuarios } = require('./usuarios');
const { Produtos } = require('./produtos');
const { Enderecos } = require('./enderecos');

const Pedido = connection.define('pedido', {
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

Pedido.belongsTo(Usuarios, { foreignKey: 'compradorId' });
Pedido.belongsTo(Usuarios, { foreignKey: 'vendedorId' });
Pedido.belongsTo(Produtos, { foreignKey: 'produtoId' });
Pedido.belongsTo(Enderecos, {
  foreignKey: 'usuariosEnderecosId',
});

module.exports = { Pedido };