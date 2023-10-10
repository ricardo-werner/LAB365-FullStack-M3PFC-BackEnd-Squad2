const {
    criarCarrinho,
    listarCarrinhos,
    listarCarrinhoId,
    atualizarCarrinhoId,
    deletarCarrinhoId,
    //restaurarCarrinhoId,
} = require('../controllers/carrinho.controller')
const { Router } = require('express')
const { auth } = require('../middleware/auth')

class CarrinhoRouter {
    routesFromCarrinho() {
        const carrinhoRoutes = Router()
        carrinhoRoutes.post('/carrinho/criar', criarCarrinho)
        carrinhoRoutes.get('/carrinhos/listar', listarCarrinhos)
        carrinhoRoutes.get('/carrinho/listarId/:id', listarCarrinhoId)
        carrinhoRoutes.patch('/carrinho/atualizarId/:id', atualizarCarrinhoId)
        carrinhoRoutes.delete('/carrinho/deletarId/:id', deletarCarrinhoId)
        //carrinhoRoutes.patch('/carrinho/restaurarId/:id', auth, restaurarCarrinhoId)
        return carrinhoRoutes
    }
}

module.exports = new CarrinhoRouter()