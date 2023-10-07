const { Router } = require("express");
const { routesFromUsuario } = require("./usuario.routes");
const { routesFromComprador } = require('./comprador.routes');

const routes = new Router();
routes.use("/api", [routesFromUsuario(), routesFromComprador()]);

module.exports = routes;
