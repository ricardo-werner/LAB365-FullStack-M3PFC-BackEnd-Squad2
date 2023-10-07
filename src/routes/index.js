const { Router } = require('express');

const routes = Router();

const { routesFromProduto } = require("./produtos.routes");

routes.use("/api", [routesFromProduto()]);

module.exports = routes;
