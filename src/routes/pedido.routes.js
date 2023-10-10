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
        pedidoRoutes.post('/pedido/criar', criarPedido)
        pedidoRoutes.get('/pedidos/listar', listarPedidos)
        pedidoRoutes.get('/pedido/listarId/:id', listarPedidoId)
        pedidoRoutes.delete('/pedido/deletarId/:id', deletarPedidoId)
        return pedidoRoutes
    }
}

module.exports = new PedidoRouter()