const { Router } = require('express')
//const { routesFromUsuario } = require('./usuario.routes')
const { routesFromVendas} = require('./vendas.routes')


const routes = Router()

routes.use('/api', [
  //routesFromUsuario(),
  routesFromVendas(),

])

module.exports = routes;