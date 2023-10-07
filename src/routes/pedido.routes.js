const {
    criarPedido,
    listarPedidos,
    listarPedidoId,
    deletarPedidoId,
} = require('../controllers/pedido.controller')
const { Router } = require('express')
const { auth } = require('../middleware/auth')

class PedidoRouter {
    routesFromPedido() {
        const pedidoRoutes = Router()
        pedidoRoutes.post('/criarPedido', criarPedido)
        pedidoRoutes.get('/listarPedidos', listarPedidos)
        pedidoRoutes.get('/listarPedidoId/:id', listarPedidoId)
        pedidoRoutes.delete('/deletarPedidoId/:id', deletarPedidoId)
        return pedidoRoutes
    }
}

module.exports = new PedidoRouter()