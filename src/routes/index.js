const { Router } = require('express');
const testRoutes = require('./test.routes');

const routes = Router();

routes.use('/api', testRoutes);

module.exports = routes;
