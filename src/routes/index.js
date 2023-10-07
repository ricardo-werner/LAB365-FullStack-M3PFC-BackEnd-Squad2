const { Router } = require('express')
const routes = Router()

const { routesFromUsuario } = require("./usuario.routes");
const { routesFromVendas} = require('./vendas.routes')
const { routesFromProduto } = require("./produtos.routes");

routes.use('/api', [
  routesFromVendas(),
  routesFromUsuario(),
  routesFromProduto(),
])

module.exports = routes