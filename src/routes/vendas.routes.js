const {
    criarVenda,
    listarVendas,
    listarVendaId,
    atualizarVendaId,
    //deleteOneVenda,
    //restoreOneVenda
} = require('../controllers/vendas.controller')
const { Router } = require('express')
const { auth } = require('../middleware/auth')

class VendaRouter {
    routesFromVendas() {
        const vendasRoutes = Router()
        vendasRoutes.post('/criarVenda', criarVenda)
        vendasRoutes.get('/listarVendas', listarVendas)
        vendasRoutes.get('/listarVendaId/:id', listarVendaId)
        vendasRoutes.patch('/atualizarVendaId/:id', atualizarVendaId)
        //vendasRoutes.delete('/deletarVendaId/:id', auth, deletarVendaId)
        //vendasRoutes.patch('/restaurarVendaId/:id', auth, restoreOneVendaId)
        return vendasRoutes
    }
}

module.exports = new VendaRouter()