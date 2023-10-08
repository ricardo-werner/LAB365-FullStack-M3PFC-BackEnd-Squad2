const { Router } = require("express");
const { routesFromUsuario } = require("./usuario.routes");
const { routesFromVendas } = require("./vendas.routes");
const { routesFromCarrinho } = require("./carrinho.routes");
const { routesFromPedido } = require("./pedido.routes");
const { routesFromProduto } = require("./produtos.routes");
const { routesFromComprador } = require("./comprador.routes");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger/swagger-output.json");

const routes = Router();

routes.use("/api", [
  routesFromUsuario(),
  // #swagger.tags = ['Usuários']
]);

routes.use("/api", [
  routesFromVendas(),
  // #swagger.tags = ['Vendas']
]);

routes.use("/api", [
  routesFromCarrinho(),
  // #swagger.tags = ['Carrinho']
]);

routes.use("/api", [
  routesFromPedido(),
  // #swagger.tags = ['Pedidos']
]);

routes.use("/api", [
  routesFromProduto(),
  // #swagger.tags = ['Produtos']
]);

routes.use("/api", [
  routesFromComprador(),
  // #swagger.tags = ['Comprador']
]);

routes.use(
  "/api-docs",
  // #swagger.ignore = true,
  swaggerUi.serve
);

routes.get(
  "/api-docs",
  // #swagger.ignore = true
  swaggerUi.setup(swaggerDocument)
);

module.exports = routes;
