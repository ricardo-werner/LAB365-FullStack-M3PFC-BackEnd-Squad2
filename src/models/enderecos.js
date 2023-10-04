const { STRING, FLOAT, DATE } = require('sequelize');
const { connection } = require('../database/connection');
const { Usuarios } = require('./usuarios');
const { UsuariosEnderecos } = require('./usuariosEnderecos');

const Enderecos = connection.define(
  'enderecos',
  {
    cep: STRING,
    logradouro: STRING,
    numero: STRING,
    bairro: STRING,
    cidade: STRING,
    estado: STRING,
    complemento: {
      type: STRING,
      allowNull: true,
    },
    lat: {
      type: FLOAT,
      allowNull: true,
    },
    long: {
      type: FLOAT,
      allowNull: true,
    },
    createdAt: DATE,
    updatedAt: DATE,
  },
  { underscored: true, paranoid: true }
);

module.exports = {
  Enderecos,
};
