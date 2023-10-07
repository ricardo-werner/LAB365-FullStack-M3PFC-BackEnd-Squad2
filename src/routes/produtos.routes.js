const { Router } = require("express");
const { auth } = require("../middleware/auth");

const {
  cadastrarProduto,
  listarProdutos,
  listarProduto,
} = require("../controllers/produtos.controller");

class ProdutosRoutes {
  routesFromProduto() {
    const produtosRoutes = Router();
    produtosRoutes.post("/products/admin", cadastrarProduto);
    produtosRoutes.get("/products/admin/:offset/:limit", listarProdutos);
    produtosRoutes.get("/produto/:produtoId", listarProduto);
    return produtosRoutes;
  }
}

module.exports = new ProdutosRoutes();
