const { Router } = require('express')
const { routesFromUsuario } = require('./usuario.routes')
const { routesFromVendas } = require('./vendas.routes')
const { routesFromCarrinho } = require('./carrinho.routes')
const { routesFromPedido } = require('./pedido.routes')

const { routesFromUsuario } = require("./usuario.routes");
const { routesFromVendas} = require('./vendas.routes')

routes.use('/api', [
  routesFromUsuario(),
])

module.exports = routes