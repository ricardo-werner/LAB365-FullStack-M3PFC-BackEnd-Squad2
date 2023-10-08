const { Router } = require('express')
const { routesFromUsuario } = require('./usuario.routes')
const { routesFromVendas } = require('./vendas.routes')
const { routesFromCarrinho } = require('./carrinho.routes')
const { routesFromPedido } = require('./pedido.routes')
const { routesFromProduto } = require('./produtos.routes');

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger/swagger-output.json");

const routes = Router()

routes.use('/api', [
  routesFromUsuario(),
  routesFromVendas(),
  routesFromCarrinho(),
  routesFromPedido(),
  routesFromProduto(),
])

routes.use("/api-docs", swaggerUi.serve);
routes.get("/api-docs", swaggerUi.setup(swaggerDocument));

module.exports = routes
