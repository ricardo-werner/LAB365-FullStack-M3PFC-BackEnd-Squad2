const {
  criarVenda,
  listarVendas,
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
    vendasRoutes.post('/venda/criar', auth, criarVenda);
    vendasRoutes.get('/vendas/lista', auth, listarVendas);
    vendasRoutes.get(
      '/admin/vendas/lista',
      auth,
      checarAdmin,
      listarVendaAdmin
    );
    vendasRoutes.patch(
      'admin/vendas/atualizar/:id',
      auth,
      checarAdmin,
      atualizarVendaId
    );
    vendasRoutes.get(
      '/admin/dashboard',
      auth,
      checarAdmin,
      vendasAdminDashboard
    );
    //vendasRoutes.delete('/venda/deletarId/:id', auth, deletarVendaId)
    //vendasRoutes.patch('/venda/restaurarId/:id', auth, restaurarVendaId)
    return vendasRoutes;
  }
}

module.exports = new VendaRouter();
