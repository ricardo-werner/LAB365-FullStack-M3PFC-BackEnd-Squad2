const { Enderecos } = require('./enderecos');
const { Usuarios } = require('./usuarios');
const { UsuariosEnderecos } = require('./usuariosEnderecos');

Usuarios.belongsToMany(Enderecos, {
  through: UsuariosEnderecos,
  foreignKey: 'usuarioId', 
});

Enderecos.belongsToMany(Usuarios, {
  through: UsuariosEnderecos,
  foreignKey: 'enderecoId', 
});
