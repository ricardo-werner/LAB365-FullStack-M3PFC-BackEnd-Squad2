const { Router } = require('express')
const { routesFromUsuario } = require('./usuario.routes')
const { routesFromVendas } = require('./vendas.routes')
const { routesFromCarrinho } = require('./carrinho.routes')
const { routesFromPedido } = require('./pedido.routes')
const { routesFromProduto } = require('./produtos.routes');

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger/swagger.json");

const routes = Router()

routes.use('/api', [
  routesFromUsuario(),
  routesFromVendas(),
  routesFromCarrinho(),
  routesFromPedido(),
  routesFromProduto(),
])

router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));

module.exports = routes
