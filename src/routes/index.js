const { Router } = require('express');
const { routesFromUsuario } = require('./usuario.routes');
const { routesFromVendas } = require('./vendas.routes');
const { routesFromProduto } = require('./produtos.routes');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger-output.json');

const routes = Router();

routes.use('/api', [
  routesFromUsuario(),
  // #swagger.tags = ['Usuários']
]);

routes.use('/api', [
  routesFromVendas(),
  // #swagger.tags = ['Vendas']
]);

routes.use('/api', [
  routesFromProduto(),
  // #swagger.tags = ['Produtos']
]);

routes.use(
  '/api-docs',
  // #swagger.ignore = true,
  swaggerUi.serve
);

routes.get(
  '/api-docs',
  // #swagger.ignore = true
  swaggerUi.setup(swaggerDocument)
);

module.exports = routes;
