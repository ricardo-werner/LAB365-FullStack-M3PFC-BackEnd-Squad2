const { Router } = require('express');
const { listarComprador } = require('../controller/comprador.controller');
const { auth } = require('../middleware/auth');

class Comprador {
  router() {
    const compradorRoutes = Router();

    compradorRoutes.get('/comprador/:offset/:limite', auth, listarComprador);

    return compradorRoutes;
  }
}

module.exports = new Comprador().router();
