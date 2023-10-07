const { Router } = require('express')
const routes = Router()

const { routesFromUsuario } = require("./usuario.routes");
const { routesFromVendas} = require('./vendas.routes')

routes.use('/api', [
  routesFromVendas(),
  routesFromUsuario(),
])

module.exports = routes