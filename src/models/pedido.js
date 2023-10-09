const { INTEGER, ENUM, DATE } = require('sequelize');
const { connection } = require('../database/connection');

const Pedido = connection.define('pedido', {
  vendedor_id: {
    type: INTEGER,
    allowNull: false,
  },
  endereco_id: {
    type: INTEGER,
    allowNull: false,
  },
  quantidade: {
    type: INTEGER,
    allowNull: false,
  },
  valorTotal: {
    type: DECIMAL(10, 2),
    allowNull: false,
  },
  tipo_pagamento: {
    type: ENUM('Cartão de Crédito', 'Cartão de Débito', 'Boleto', 'Pix', 'Transferência Bancária'),
    defaultValue: 'Pix',
    allowNull: false,
  },
  status: {
    type: ENUM('Aberto', 'Concluído', 'Cancelado'),
    defaultValue: 'Aberto',
    allowNull: false,
  },
  created_at: {
    allowNull: false,
    type: DATE,
    defaultValue: connection.literal('CURRENT_TIMESTAMP'),
  },
});

pedido.associate = (models) => {
  // Associação com a tabela de junção "pedidoProduto"
  pedido.belongsToMany(models.produtos, {
    through: 'pedidoProduto',
    foreignKey: 'pedido_id',
  });
};

module.exports = { Pedido };