const { listarComprador } = require('../controllers/comprador.controller');
const { auth } = require('../middleware/auth');
const { Router } = require('express');


class CompradorRouter {
  routesFromComprador() {
    const compradorRoutes = Router();

    compradorRoutes.get('/comprador/:offset/:limite', auth, listarComprador);

    return compradorRoutes;
  }
}

module.exports = new CompradorRouter();
