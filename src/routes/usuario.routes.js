const { Router } = require('express');
const {
  login,
  adicionarUsuarioComprador,
  adicionarUsuarioAdmin,
  adicionarNovoEndereco,
  listarUsuarioPorId,
  listarEnderecosComprador,
  atualizarCompradorPorId,
  recuperarSenha,
  listarUsuarios,
} = require('../controllers/usuario.controller');
const { auth } = require('../middleware/auth');
const { checarAdmin } = require('../middleware/checarAdmin');

class UsuarioRouter {
  routesFromUsuario() {
    const usuarioRoutes = Router();

    usuarioRoutes.post('/usuario/login', login); //01 e 02 ok
    usuarioRoutes.post('/usuario/cadastrar', adicionarUsuarioComprador); //03 ok
    usuarioRoutes.post(
      //04 ok
      '/usuario/admin/cadastro',
      auth,
      checarAdmin,
      adicionarUsuarioAdmin
    );
    usuarioRoutes.get(
      //12 ok
      '/comprador/admin/:usuario_id',
      auth,
      checarAdmin,
      listarUsuarioPorId
    );
    usuarioRoutes.get('/comprador/endereco', auth, listarEnderecosComprador); //09 ok
    usuarioRoutes.patch(
      '/comprador/admin/:usuario_id', //13 ok
      auth,
      checarAdmin,
      atualizarCompradorPorId
    );
    usuarioRoutes.get(
      //11 ok
      '/comprador/admin/:offset/:limite',
      auth,
      checarAdmin,
      listarUsuarios
    );
    usuarioRoutes.post('/usuario/novo-endereco', auth, adicionarNovoEndereco);
    usuarioRoutes.post('/usuario/nova-senha', recuperarSenha);

    return usuarioRoutes;
  }
}

module.exports = new UsuarioRouter();
