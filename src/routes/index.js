const { Router } = require('express')
const { routesFromUsuario } = require('./usuario.routes')


const routes = Router()

routes.use('/api', [
  routesFromUsuario(),

])

module.exports = routes