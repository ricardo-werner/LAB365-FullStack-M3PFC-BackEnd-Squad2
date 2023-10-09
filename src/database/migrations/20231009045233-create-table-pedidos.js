'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pedidos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      vendedor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'usuarios'
          },
          key: 'id'
        }
      },
      produto_id: {
        type: Sequelize.ARRAY(Sequelize.INTEGER), // Para armazenar vários IDs de produtos
        allowNull: false,
        references: {
          model: {
            tableName: 'produtos'
          },
          key: 'id'
        }
      },
      endereco_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'enderecos'
          },
          key: 'id'
        }
      },
      quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      valorTotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      tipo_pagamento: {
        type: Sequelize.ENUM('Cartão de Crédito', 'Cartão de Débito', 'Boleto', 'Pix', 'Transferencia Bancaria'),
        defaultValue: 'PIX',
        allowNull: false

      },
      status: {
        type: Sequelize.ENUM('Aberto', 'Concluido', 'Cancelado'),
        defaultValue: 'Aberto',
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pedidos');
  },
};
