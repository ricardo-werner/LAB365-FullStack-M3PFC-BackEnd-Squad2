const { criarEndereco, criarUsuario } = require('../controller/test');
const { Router } = require('express');

class TestRouter {
  router() {
    const testRoutes = Router();

    testRoutes.post('/criarendereco', criarEndereco);

    return testRoutes;
  }
}

module.exports = new TestRouter().router();
