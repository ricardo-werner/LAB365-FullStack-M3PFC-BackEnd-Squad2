const { Router } = require('express');
const {
  login,
  adicionarUsuarioComprador,
  adicionarUsuarioAdmin,
  listarUsuarioPorId,
  listarEnderecosComprador,
  atualizarCompradorPorId,
  recuperarSenha,
  listarComprador,
} = require('../controllers/usuario.controller');
const { auth } = require('../middleware/auth');
const { checarAdmin } = require('../middleware/checarAdmin');

class UsuarioRouter {
  routesFromUsuario() {
    const usuarioRoutes = Router();

    usuarioRoutes.post('/usuario/login', login);
    usuarioRoutes.post('/usuario/cadastrar', adicionarUsuarioComprador);
    usuarioRoutes.post('/usuario/admin/cadastro', auth, adicionarUsuarioAdmin);
    usuarioRoutes.get(
      '/comprador/admin/:usuario_id',
      auth,
      checarAdmin,
      listarUsuarioPorId
    );
    usuarioRoutes.get('/comprador/endereco', auth, listarEnderecosComprador);
    usuarioRoutes.patch(
      '/comprador/admin/:usuario_id',
      auth,
      checarAdmin,
      atualizarCompradorPorId
    );
    usuarioRoutes.get('/comprador/:offset/:limite', auth, listarComprador);
    usuarioRoutes.post('/usuario/nova-senha', auth, recuperarSenha);

    return usuarioRoutes;
  }
}

module.exports = new UsuarioRouter();
