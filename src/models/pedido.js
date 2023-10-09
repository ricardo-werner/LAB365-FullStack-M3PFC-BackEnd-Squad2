const { INTEGER, DECIMAL, ENUM, DATE } = require('sequelize');
const { connection } = require('../database/connection');
const { Usuarios } = require('./usuarios');
const { Produtos } = require('./produtos');
const { Enderecos } = require('./enderecos');

const Pedido = connection.define('pedido', {
  compradorId: {
    type: INTEGER,
    allowNull: false,
    references: {
      model: {
        tableName: 'usuarios'
      },
      key: 'id'
    }
  },
  vendedorId: {
    type: INTEGER,
    allowNull: false,
    references: {
      model: {
        tableName: 'usuarios'
      },
      key: 'id'
    }
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
  enderecoId: {
    type: INTEGER,
    allowNull: false,
    references: {
      model: {
        tableName: 'enderecos'
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
  tipoPagamento: {
    type: ENUM('Cartão de Crédito', 'Cartão de Débito', 'Boleto', 'Pix', 'Transferencia Bancaria'),
    defaultValue: 'PIX',
    allowNull: false
  },
  status: {
    type: ENUM('Aberto', 'Concluido', 'Cancelado'),
    defaultValue: 'Aberto',
    allowNull: false
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