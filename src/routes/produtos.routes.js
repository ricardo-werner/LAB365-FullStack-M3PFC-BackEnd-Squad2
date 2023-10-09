const { Router } = require("express");
const { auth } = require("../middleware/auth");

const {
  cadastrarProduto,
  listarProdutosAdmin,
  filtrarProdutos,
  detalharProduto,
  atualizarProduto,
} = require("../controllers/produtos.controller");

class ProdutosRoutes {
  routesFromProduto() {
    const produtosRoutes = Router();
    produtosRoutes.post("/produtos/admin", auth, cadastrarProduto);
    produtosRoutes.get("/produto/admin", listarProdutosAdmin);
    produtosRoutes.get("/produto/:offset/:limit", auth, filtrarProdutos);
    produtosRoutes.get("/produto/:produtoId", auth,  detalharProduto);
    produtosRoutes.patch("/produto/admin/:produtoId", atualizarProduto);
    return produtosRoutes;
  }
}

module.exports = new ProdutosRoutes();
