const { Router } = require('express')
const { routesFromVendas } = require('./vendas.routes')
const { routesFromCarrinho } = require('./carrinho.routes')


const routes = Router()

routes.use('/api', [
  routesFromVendas(),
  routesFromCarrinho()

])

module.exports = routes