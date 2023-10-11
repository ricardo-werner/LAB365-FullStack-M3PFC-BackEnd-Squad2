const { Router } = require("express");
const { auth } = require("../middleware/auth");

const {
  cadastrarProduto,
  listarProdutosAdmin,
  filtrarProdutos,
  detalharProduto,
  atualizarProduto,
  mostrarTodosProdutos,
} = require("../controllers/produtos.controller");

class ProdutosRoutes {
  routesFromProduto() {
    const produtosRoutes = Router();
    produtosRoutes.post("/produtos/admin", cadastrarProduto);
    produtosRoutes.get("/produto/admin", listarProdutosAdmin);
    produtosRoutes.get("/produto/todos", mostrarTodosProdutos);
    produtosRoutes.get("/produto/:offset/:limit", filtrarProdutos);
    produtosRoutes.get("/produto/:produtoId", detalharProduto);
    produtosRoutes.patch("/produto/admin/:produtoId", atualizarProduto);
    return produtosRoutes;
  }
}

module.exports = new ProdutosRoutes();
