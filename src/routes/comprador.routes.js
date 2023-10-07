const { Router } = require('express');
const { listarComprador } = require('../controllers/comprador.controller');
const { auth } = require('../middleware/auth');

class Comprador {
  router() {
    const compradorRoutes = Router();

    compradorRoutes.get('/comprador/:offset/:limite', auth, listarComprador);

    return compradorRoutes;
  }
}

module.exports = new Comprador().router();
