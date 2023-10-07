const { Produtos } = require("../models/produtos");
const { sign } = require("jsonwebtoken");
const { config } = require("dotenv");
config();

/*
  const payload = { email: user.email };
  const token = sign(payload, process.env.SECRET_JWT);
*/

class ProdutosController {
  async cadastrarProduto(request, response) {
    try {
      const {
        usuarioId,
        nomeProduto,
        nomeLab,
        imagemProduto,
        dosagem,
        descricao,
        precoUnitario,
        tipoProduto,
        totalEstoque,
      } = request.body;

      console.log(request.body);

      if (
        !usuarioId ||
        !nomeProduto ||
        !nomeLab ||
        !imagemProduto ||
        !dosagem ||
        !descricao ||
        !precoUnitario ||
        !tipoProduto ||
        !totalEstoque
      ) {
        return response.status(422).send({
          message: "Todos os campos são obrigatórios!",
        });
      }

      if (tipoProduto !== "Controlado" && tipoProduto !== "Não Controlado") {
        return response.status(400).json({
          message: "Tipo de Produto em formato inválido!",
        });
      }

      if (precoUnitario <= 0) {
        return response.status(400).json({
          message: "O preço deve ser maior que zero",
        });
      }

      if (totalEstoque < 0) {
        return response.status(400).json({
          message: "O estoque não pode ser negativo",
        });
      }

      console.log(tipoProduto);

      const data = await Produtos.create({
        usuarioId,
        nomeProduto,
        nomeLab,
        imagemProduto,
        dosagem,
        descricao,
        precoUnitario,
        tipoProduto,
        totalEstoque,
      });

      return response.status(201).send({
        data,
        message: `Produto com o ID: ${data.id} e Nome: ${data.nomeProduto} cadastrado com sucesso!`,
      });
    } catch (error) {
      console.error(error.message);
      return response.status(400).send({
        message: "Erro ao cadastrar o remedio!",
        error: error.message,
      });
    }
  }

  /*
Endpoint Privado
GET /products/admin/:offset/:limit

Objetivo: Este endpoint deve listar todos os produtos cadastrados daquele usuário administrador
O campo userId deve ser usado através do payload do JWT do usuário ADMIN para listar os produtos deste usuário.

O endpoint deve utilizar os path params offset e limit para realizar paginação. Retornar 20 itens no máximo na página.

Na requisição, utilizar o query params para os campos name, typeProduct  como filtro e totalStock como ordenação.

Resposta da requisição:
200 se for sucesso, retornar um array de objetos contendo o resultado da busca contendo o contador do resultado máximo. 
204 se for sucesso, mas se não tiver resultados para mostrar.
401  Exceção quando tentar executar o endpoint sem autenticação.
403  Exceção quando o JWT for de comprador, este endpoint somente pode ser utilizado por um usuário TYPE_USER === “ADMIN”.
*/

  async listarProdutos(request, response) {
    try {
      //const payload = { usuarioId: user.usuarioId };
      const { offset, limit } = request.params;
      const { nomeProduto, tipoProduto } = request.query;

      if (limit > 20) {
        return response.status(400).json({
          message: "O limite deve ser menor ou igual à 20",
        });
      }

      console.log(nomeProduto)

      const { count, rows } = await Produtos.findAndCountAll({
        // where: {
        //   nomeProduto: nomeProduto,
        //   tipoProduto: tipoProduto,
        // },
        offset: offset,
        limit: limit,
        order: [["totalEstoque", "DESC"]],
      });

      console.log(count)

      if (offset > rows.length) {
        return response.status(204).send({});
      }

      if (rows.length == 0) {
        return response.status(200).send({
          message: "Nenhum produto cadastrado!",
        });
      }

      return response.status(200).send({
        rows, total: count,
      });
    } catch (error) {
      console.error(error.message);
      return response.status(400).send({
        message: "Erro ao listar o produto!",
        error: error.message,
      });
    }
  }

  /*
Endpoint Privado
GET /produto/:offset/:limite

Objetivo: Este endpoint deve listar todos os produtos cadastrados na aplicação
Utilizar o query params para os campos nome, tipo_produto  como filtro e total_estoque como ordenação
O endpoint deve utilizar os path params offset e limite para realizar paginação. Retornar 20 itens no máximo na página.
*/

  async listarProduto(request, response) {
    try {
      const { produtoId } = request.params;

      const produto = await Produtos.findOne({
        where: { id: produtoId },
      });

      if (!produto) {
        return response.status(404).send({
          message: "Produto não encontrado!",
        });
      }

      return response.status(200).send({
        produto,
      });
    } catch (error) {
      console.error(error.message);
      return response.status(400).send({
        message: "Erro ao listar o produto!",
        error: error.message,
      });
    }
  }

  /*
Endpoint Privado
PATCH /produto/admin/:produto_id

Objetivo: Este endpoint deve atualizar alguns campos do produto na aplicação.
O campo usuario_id deve ser usado através do payload do JWT do usuário ADMIN

No corpo da requisição, deve enviar um ou todos os campos abaixo para atualizar:

○        (nome) (opcional) // Não pode ser enviado como string vazia
○        (imagem_link) (opcional) // Não pode ser enviado como string vazia
○        (dosagem) (opcional) // Não pode ser enviado como string vazia
○        (total_estoque) (obrigatório) Este campo não pode ser menor que zero.

Exemplo JSON:
{
"nome": "Paracetamol",
"imagem_link": "url string",
"dosagem": "mg",
"total_estoque": 10
}

Resposta da requisição:
204 se for sucesso.
401  Exceção quando tentar executar o endpoint sem autenticação.
403 Exceção quando o JWT for de comprador, este endpoint somente pode ser utilizado por um usuário TIPO_USUSARIO === “ADMIN”
404 Exceção lançada quando não é encontrado o produto_id junto com o usuario_id
422 Exceção quando é enviado campos desconhecidos para atualização e/ou campos válidos, porém com valores indevidos de acordo com as regras dos campos.
*/
}

module.exports = new ProdutosController();
