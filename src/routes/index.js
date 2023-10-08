const { Router } = require('express')
const { routesFromUsuario } = require('./usuario.routes')
const { routesFromVendas } = require('./vendas.routes')
const { routesFromCarrinho } = require('./carrinho.routes')
const { routesFromPedido } = require('./pedido.routes')
const { routesFromProduto } = require('./produtos.routes');
const { routesFromComprador } = require('./comprador.routes');

const routes = Router()

routes.use('/api', [
  routesFromUsuario(),
  routesFromVendas(),
  routesFromCarrinho(),
  routesFromPedido(),
  routesFromProduto(),
  routesFromComprador(),
]);

module.exports = routes
