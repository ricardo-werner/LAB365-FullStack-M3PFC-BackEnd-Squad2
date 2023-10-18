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
    produtosRoutes.post('/produtos/admin', auth, checarAdmin, cadastrarProduto);
    produtosRoutes.get(
      '/produtos/admin/:offset/:limit',
      auth,
      checarAdmin,
      listarProdutosAdmin
    );
    produtosRoutes.get(
      '/produto/:offset/:limit',
      auth,
      filtrarProdutos
    );
    produtosRoutes.get('/produto/:produtoId', detalharProduto);
    produtosRoutes.patch('/produto/admin/:produtoId', atualizarProduto);
    return produtosRoutes;
  }
}

module.exports = new ProdutosRoutes();
