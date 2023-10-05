const {
    createOneVenda,
    listAllVendas,
    listOneVenda,
    updateOneVenda,
    //deleteOneVenda,
    //restoreOneVenda
} = require('../controllers/vendas.controller')
const { Router } = require('express')
const { auth } = require('../middleware/auth')

class VendaRouter {
    routesFromVendas() {
        const vendasRoutes = Router()
        vendasRoutes.post('/createOneVenda', auth, createOneVenda)
        vendasRoutes.get('/listAllVendas', auth, listAllVendas)
        vendasRoutes.get('/listOneVenda/:id', auth, listOneVenda)
        vendasRoutes.patch('/updateOneVenda/:id', auth, updateOneVenda)
        //vendasRoutes.delete('/deleteOneVenda/:id', auth, deleteOneVenda)
        //vendasRoutes.patch('/restoreOneVenda/:id', auth, restoreOneVenda)
        return vendasRoutes
    }
}

module.exports = new VendaRouter()