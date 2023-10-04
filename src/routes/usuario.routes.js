const {
    createOneUsuario,
    loginUsuario,
    listAllUsuarios,
    listOneUsuario,
    updateOneUsuario,
    updateOneStatus,
    updateOneSenha,
    deleteOneUsuario,
    restoreOneUsuario
} = require('../controllers/usuario.controller')
const { Router } = require('express')
const { auth } = require('../middleware/auth')

class UsuarioRouter {
    routesFromUsuario() {
        const usuarioRoutes = Router()
        usuarioRoutes.post('/createOneUsuario', createOneUsuario)
        usuarioRoutes.post('/loginUsuario', loginUsuario)
        usuarioRoutes.get('/listAllUsuarios', auth, listAllUsuarios)
        usuarioRoutes.get('/listOneUsuario/:id', auth, listOneUsuario)
        usuarioRoutes.patch('/updateOneUsuario/:id', auth, updateOneUsuario)
        usuarioRoutes.patch('/updateOneStatus/:id/status', auth, updateOneStatus)
        usuarioRoutes.patch('/updateOneSenha/:id/senha', auth, updateOneSenha)
        usuarioRoutes.delete('/deleteOneUsuario/:id', auth, deleteOneUsuario)
        usuarioRoutes.patch('/restoreOneUsuario/:id', auth, restoreOneUsuario)
        return usuarioRoutes
    }
}

module.exports = new UsuarioRouter()