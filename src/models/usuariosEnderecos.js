const {  DATE, INTEGER } = require('sequelize');
const { connection } = require('../database/connection');

const UsuariosEnderecos = connection.define(
  'usuarios_enderecos',
  {
    usuarioId: {
      type: INTEGER,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    enderecoId: {
      type: INTEGER,
      references: {
        model: 'enderecos',
        key: 'id',
      },
    },
    createdAt: DATE,
    updatedAt: DATE,
  },
  { underscored: true, paranoid: true }
);

module.exports = {
  UsuariosEnderecos,
};
