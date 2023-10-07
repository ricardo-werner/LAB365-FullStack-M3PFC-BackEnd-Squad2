const { Router } = require('express')
const { routesFromUsuario } = require('./usuario.routes')
const { routesFromVendas } = require('./vendas.routes')
const { routesFromCarrinho } = require('./carrinho.routes')
const { routesFromPedido } = require('./pedido.routes')

const routes = new Router();

routes.use('/api', [
  routesFromUsuario(),
  routesFromVendas(),

])

module.exports = routes