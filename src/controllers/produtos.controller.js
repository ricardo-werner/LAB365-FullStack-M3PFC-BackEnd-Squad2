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

      //*TO-DO
      //O campo usuarioId deve ser usado através do payload do JWT do usuário ADMIN

      // Verificação de autenticação JWT
      const token = request.header("Authorization");
      if (!token) {
        return response
          .status(401)
          .json({ error: "Autenticação JWT inexistente." });
      }

      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT); // Decodifica o token
        const { tipoUsuario } = decoded; // Obtém o tipo de usuário do token decodificado
        // Verificação se o usuário é ADMIN
        if (tipoUsuario !== "Administrador") {
          return response
            .status(403)
            .json({ error: "Acesso negado para este tipo de usuário." });
        }
      } catch (error) {
        return response.status(401).json({ error: "Token JWT inválido." });
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

      // Verifica se os campos obrigatórios estão ausentes ou vazios
      const camposEmFalta = [];
      // Objeto com mensagens de erro personalizadas
      const mensagensErro = {
        usuarioId: "O ID de Usuário é obrigatório.",
        nomeProduto: "O Nome do Produto é obrigatório.",
        nomeLab: "O Nome do Laboratório é obrigatório.",
        imagemProduto: "O Link da Imagem é obrigatório.",
        dosagem: "O campo Dosagem é obrigatório.",
        precoUnitario: "O campo Preço Unitário é obrigatório.",
        tipoProduto: "O Tipo de Produto é obrigatório.",
        totalEstoque: "O Estoque é obrigatório.",
      };

      // Verifica os campos obrigatórios
      for (const campo in mensagensErro) {
        if (!request.body[campo]) {
          camposEmFalta.push(mensagensErro[campo]);
        }
      }

      // Se houver campos em falta, retorne o status 422 com as mensagens de erro
      if (camposEmFalta.length > 0) {
        return response.status(422).json({ error: camposEmFalta.join("\n") });
      }

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
        message: "Erro ao cadastrar o Produto!",
        error: error.message,
      });
    }
  }

  async listarProdutosAdmin(request, response) {
    try {
      //*TO-DO
      //O campo usuarioId deve ser usado através do payload do JWT do usuário ADMIN

      // Verificação de autenticação JWT
      const token = request.header("Authorization");
      if (!token) {
        return response
          .status(401)
          .json({ error: "Autenticação JWT inexistente." });
      }

      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT); // Decodifica o token
        const { tipoUsuario } = decoded; // Obtém o tipo de usuário do token decodificado
        // Verificação se o usuário é ADMIN
        if (tipoUsuario !== "Administrador") {
          return response
            .status(403)
            .json({ error: "Acesso negado para este tipo de usuário." });
        }
      } catch (error) {
        return response.status(401).json({ error: "Token JWT inválido." });
      }
      const { nomeProduto, tipoProduto } = request.query;

      const produto = await Produtos.findAll({
        where: {
          nomeProduto: nomeProduto,
          tipoProduto: tipoProduto,
        },
        order: [["totalEstoque", "DESC"]],
      });

      if (produto.length == 0) {
        return response.status(204).send({});
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

  async filtrarProdutos(request, response) {
    try {
      //*TO-DO
      //O campo usuarioId deve ser usado através do payload do JWT do usuário ADMIN

      // Verificação de autenticação JWT
      const token = request.header("Authorization");
      if (!token) {
        return response
          .status(401)
          .json({ error: "Autenticação JWT inexistente." });
      }

      const { offset, limit } = request.params;
      const { nomeProduto, tipoProduto } = request.query;

      if (limit > 20) {
        return response.status(400).json({
          message: "O limite deve ser menor ou igual à 20",
        });
      }

      const produto = await Produtos.findAll({
        where: {
          nomeProduto: nomeProduto,
          tipoProduto: tipoProduto,
        },
        offset: offset,
        limit: limit,
        order: [["totalEstoque", "DESC"]],
      });

      if (produto.length == 0) {
        return response.status(204).send({});
      }

      return response.status(200).send({
        produto,
        "Total de produtos filtrados": produto.length,
      });
    } catch (error) {
      console.error(error.message);
      return response.status(400).send({
        message: "Erro ao listar o produto!",
        error: error.message,
      });
    }
  }

  async detalharProduto(request, response) {
    try {
      const token = request.header("Authorization");
      if (!token) {
        return response
          .status(401)
          .json({ error: "Autenticação JWT inexistente." });
      }

      const { produtoId } = request.params;

      const produto = await Produtos.findOne({
        where: { id: produtoId },
      });

      if (!produto) {
        return response.status(404).send({
          message: `Produto com o ID ${produtoId} não encontrado!`,
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

  async atualizarProduto(request, response) {
    try {
      const { produtoId } = request.params;

      const { nomeProduto, imagemProduto, dosagem, totalEstoque } =
        request.body;

      //Verificação de autenticação JWT
      const token = request.header("Authorization");
      if (!token) {
        return response
          .status(401)
          .json({ error: "Autenticação JWT inexistente." });
      }

      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT); // Decodifica o token
        const { tipoUsuario } = decoded; // Obtém o tipo de usuário do token decodificado
        // Verificação se o usuário é ADMIN
        if (tipoUsuario !== "Administrador") {
          return response
            .status(403)
            .json({ error: "Acesso negado para este tipo de usuário." });
        }
      } catch (error) {
        return response.status(401).json({ error: "Token JWT inválido." });
      }

      const produto = await Produtos.findOne({
        where: { id: produtoId },
      });

      if (!produto) {
        return response.status(404).send({
          message: `Produto com o ID ${produtoId} não encontrado!`,
        });
      }

      if (totalEstoque < 0 || !totalEstoque) {
        return response.status(422).json({
          message: "O estoque não pode ser negativo ou nulo",
        });
      }

      if (nomeProduto === "") {
        return response.status(422).json({
          message: "O nome do produto não pode ser vazio",
        });
      }

      if (imagemProduto === "") {
        return response.status(422).json({
          message: "O link da imagem do produto não pode ser vazio",
        });
      }

      if (dosagem === "") {
        return response.status(422).json({
          message: "A dosagem não pode ser vazia",
        });
      }

      await Produtos.update(
        {
          nomeProduto,
          imagemProduto,
          dosagem,
          totalEstoque,
        },
        {
          where: {
            id: produtoId,
          },
        }
      );

      return response.status(204).send({
      });
    } catch (error) {
      console.error(error.message);
      return response.status(400).send({
        message: "Erro ao atualizar o Produto!",
        error: error.message,
      });
    }
  }
}

module.exports = new ProdutosController();