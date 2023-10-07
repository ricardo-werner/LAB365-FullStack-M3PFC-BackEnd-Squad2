const { STRING, ENUM, DATE, INTEGER } = require('sequelize');
const { connection } = require('../database/connection');

const Usuarios = connection.define(
  "usuarios",
  {
    enderecoId: {
      type: INTEGER,
      references: {
        model: "enderecos",
        key: "id",
      },
    },
    nomeCompleto: STRING,
    cpf: {
      type: STRING(11),
      unique: true,
      validate: {
        is: {
          args: /^[0-9]{11}$/, // Validação para garantir que o CPF contenha 11 números
          msg: "O CPF deve conter exatamente 11 números.",
        },
      },
    },
    dataNascimento: STRING,
    telefone: STRING,
    email: {
      type: STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    senha: {
      type: STRING,
      allowNull: false,
    },
    criadoPor: {
      type: STRING,
      allowNull: true,
    },
    tipoUsuario: {
      type: ENUM("Administrador", "Comprador"),
      defaultValue: "Comprador",
    },
    createdAt: DATE,
    updatedAt: DATE,
  },
  { underscored: true, paranoid: true }
);

module.exports = {
  Usuarios,
};
