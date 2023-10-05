const { ENUM, DATE, DECIMAL, INTEGER } = require('sequelize');
const { connection } = require('../database/connection');
const { Usuarios } = require('./usuarios');
const { Produtos } = require('./produtos');
const { Enderecos } = require('./enderecos');

const Vendas = connection.define(
  'vendas',
  {
    compradorId: {
      type: INTEGER,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    vendedorId: {
      type: INTEGER,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    produtoId: {
      type: INTEGER,
      references: {
        model: 'produtos',
        key: 'id',
      },
    },
    usuariosEnderecosId: {
      type: INTEGER,
      references: {
        model: 'usuarios_enderecos',
        key: 'id',
      },
    },
    precoUnitario: DECIMAL(10, 2),
    quantidadeProdutoVendido: INTEGER,
    total: DECIMAL(10, 2),
    tipoPagamento: ENUM(
      'cartão de crédito',
      'cartão de débito',
      'PIX',
      'boleto',
      'transferência bancária'
    ),
    createdAt: DATE,
    updatedAt: DATE,
  },
  { underscored: true, paranoid: true }
);

Vendas.belongsTo(Usuarios, { foreignKey: 'compradorId' });
Vendas.belongsTo(Usuarios, { foreignKey: 'vendedorId' });
Vendas.belongsTo(Produtos, { foreignKey: 'produtoId' });
Vendas.belongsTo(Enderecos, {
  foreignKey: 'usuariosEnderecosId',
});

module.exports = {
  Vendas,
};
