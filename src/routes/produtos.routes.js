const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { checarAdmin } = require('../middleware/checarAdmin');

const {
  cadastrarProduto,
  listarProdutosAdmin,
  filtrarProdutos,
  detalharProduto,
  atualizarProduto,
} = require('../controllers/produtos.controller');

class ProdutosRoutes {
  routesFromProduto() {
    const produtosRoutes = Router();
    produtosRoutes.post('/produtos/admin', auth, checarAdmin, cadastrarProduto); //5 ok
    produtosRoutes.get(
      '/produtos/admin/:offset/:limit',
      auth,
      checarAdmin,
      listarProdutosAdmin
    ); //6 ok
    produtosRoutes.get('/produtos/:offset/:limit', auth, filtrarProdutos); //7 ok
    produtosRoutes.get('/produto/:produtoId', auth, detalharProduto); //8 ok
    produtosRoutes.patch(
      '/produto/admin/:produtoId',
      auth,
      checarAdmin,
      atualizarProduto
    ); //10 ok
    return produtosRoutes;
  }
}

module.exports = new ProdutosRoutes();
