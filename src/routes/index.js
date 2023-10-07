const { Router } = require("express");
const { routesFromUsuario } = require("./usuario.routes");

const routes = new Router();
routes.use("/api", [routesFromUsuario()]);

module.exports = routes;