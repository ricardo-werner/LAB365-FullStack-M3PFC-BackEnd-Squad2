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
        carrinhoRoutes.post('/criarCarrinho', criarCarrinho)
        carrinhoRoutes.get('/listarCarrinhos', listarCarrinhos)
        carrinhoRoutes.get('/listarCarrinhoId/:id', listarCarrinhoId)
        carrinhoRoutes.patch('/atualizarCarrinhoId/:id', atualizarCarrinhoId)
        carrinhoRoutes.delete('/deletarCarrinhoId/:id', deletarCarrinhoId)
        //carrinhoRoutes.patch('/restaurarCarrinhoId/:id', auth, restaurarCarrinhoId)
        return carrinhoRoutes
    }
}

module.exports = new CarrinhoRouter()