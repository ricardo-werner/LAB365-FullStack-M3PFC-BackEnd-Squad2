const { Router } = require('express')
const { routesFromVendas} = require('./vendas.routes')


const routes = Router()

routes.use('/api', [
  routesFromVendas(),

])

module.exports = routes