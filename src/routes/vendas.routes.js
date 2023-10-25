const {
  criarVenda,
  listarCompras,
  listarVendaAdmin,
  atualizarVendaId,
  vendasAdminDashboard,
  //deleteOneVenda,
  //restoreOneVenda
} = require('../controllers/vendas.controller');
const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { checarAdmin } = require('../middleware/checarAdmin');

class VendaRouter {
  routesFromVendas() {
    const vendasRoutes = Router();
    vendasRoutes.post('/vendas/criar', auth, criarVenda); //14 ok
    vendasRoutes.get('/vendas/lista', auth, listarCompras); //15 ok
    vendasRoutes.get(
      '/admin/vendas/lista', //16 ok
      auth,
      checarAdmin,
      listarVendaAdmin
    );
    vendasRoutes.patch(
      //extra? onde está sendo usando?
      'admin/vendas/atualizar/:id',
      auth,
      checarAdmin,
      atualizarVendaId
    );
    vendasRoutes.get(
      '/admin/dashboard', //17 ok
      auth,
      checarAdmin,
      vendasAdminDashboard
    );

    return vendasRoutes;
  }
}

module.exports = new VendaRouter();
