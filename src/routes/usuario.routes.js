const {
  adicionarUsuarioAdmin,
  adicionarUsuarioComprador,
  login,
} = require("../controllers/usuario.controller");

const { Router } = require("express");

class UsuarioRouter {
  routesFromUsuario() {
    const usuarioRoutes = Router();

    usuarioRoutes.post("usuario/login", login);
    usuarioRoutes.post("usuario/cadastrar", adicionarUsuarioComprador);
    usuarioRoutes.post("usuario/admin/cadastro", adicionarUsuarioAdmin);

    return usuarioRoutes;
  }
}

module.exports = new UsuarioRouter();
