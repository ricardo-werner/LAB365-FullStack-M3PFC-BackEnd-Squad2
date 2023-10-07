const { Router } = require('express')
const { routesFromVendas } = require('./vendas.routes')
const { routesFromCarrinho } = require('./carrinho.routes')
const { routesFromPedido } = require('./pedido.routes')


const routes = Router()

routes.use('/api', [
  routesFromVendas(),
  routesFromCarrinho(),
  routesFromPedido(),

])

module.exports = routes