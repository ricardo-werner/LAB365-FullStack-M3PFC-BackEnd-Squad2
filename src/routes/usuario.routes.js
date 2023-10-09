const {
  adicionarUsuarioAdmin,
  adicionarUsuarioComprador,
  login,
  listarUsuarioPorId,
  atualizarCompradorPorId,
  listarComprador,
  recuperarSenha,
  listarEnderecosComprador
} = require('../controllers/usuario.controller');
const { auth } = require('../middleware/auth');

const { Router } = require('express');
const { checarAdmin } = require('../middleware/checarAdmin');

class UsuarioRouter {
  routesFromUsuario() {
    const usuarioRoutes = Router();

    usuarioRoutes.post('/usuario/login', login);
    usuarioRoutes.post('/usuario/cadastrar', adicionarUsuarioComprador);
    usuarioRoutes.post('/usuario/admin/cadastro', auth, checarAdmin, adicionarUsuarioAdmin);
    usuarioRoutes.get(
      '/comprador/admin/:usuario_id',
      auth,
      listarUsuarioPorId
    );
    usuarioRoutes.get(
      '/comprador/endereco',
      auth,
      listarEnderecosComprador
    );
    usuarioRoutes.patch(
      '/comprador/admin/:usuario_id',
      auth,
      atualizarCompradorPorId
    );
    usuarioRoutes.get(
      '/comprador/:offset/:limite',
      auth,
      listarComprador
    );
    usuarioRoutes.post('/usuario/nova-senha', auth, recuperarSenha);

    return usuarioRoutes;
  }
}

module.exports = new UsuarioRouter();
