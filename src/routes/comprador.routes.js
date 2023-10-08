const { Router } = require('express');
const { auth } = require('../middleware/auth');
const {
  listarComprador,
  listarUsuarioPorId,
  atualizarCompradorPorId,
} = require('../controllers/comprador.controller');

class CompradorRouter {
  routesFromComprador() {
    const compradorRoutes = Router();

    compradorRoutes.get(
      '/comprador/admin/:usuario_id',
      auth,
      listarUsuarioPorId
    );
    compradorRoutes.patch(
      '/comprador/admin/:usuario_id',
      auth,
      atualizarCompradorPorId
    );
    compradorRoutes.get('/comprador/:offset/:limite', auth, listarComprador);

    return compradorRoutes;
  }
}

module.exports = new CompradorRouter();
