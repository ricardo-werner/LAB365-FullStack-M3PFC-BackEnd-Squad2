const { Produtos } = require('../models/produtos');
const { config } = require('dotenv');
config();

class ProdutosController {
  async cadastrarProduto(req, res) {
    try {
      const {
        nomeProduto,
        nomeLab,
        imagemProduto,
        dosagem,
        descricao,
        precoUnitario,
        tipoProduto,
        totalEstoque,
      } = req.body;

      const usuarioAutenticadoId = req.usuario.id;
      // Obter o usuário ID do corpo da solicitação ou usar o ID do usuário autenticado
      const usuarioIdBody = req.body.usuarioId || usuarioAutenticadoId;

      // Verifique se o usuarioId do corpo da solicitação é igual ao ID do usuário autenticado
      if (usuarioIdBody !== usuarioAutenticadoId) {
        return res.status(403).json({
          message: 'Você não tem permissão para cadastrar um produto para outro usuário.',
        });
      }

      const tiposPermitidos = ['Controlado', 'Não Controlado'];
      if (!tiposPermitidos.includes(tipoProduto)) {
        return response.status(400).json({
          message:
            "O Tipo de Produto deve ser 'Controlado' ou 'Não Controlado'",
        });
      }

      if (precoUnitario <= 0) {
        return res.status(400).json({
          message: 'O preço deve ser maior que zero',
        });
      }

      if (totalEstoque < 0) {
        return res.status(400).json({
          message: 'O estoque não pode ser negativo',
        });
      }

      // Verifica se os campos obrigatórios estão ausentes ou vazios
      const camposEmFalta = [];
      // Objeto com mensagens de erro personalizadas
      const mensagensErro = {
        // usuarioId: 'O ID de Usuário é obrigatório.',
        nomeProduto: 'O Nome do Produto é obrigatório.',
        nomeLab: 'O Nome do Laboratório é obrigatório.',
        imagemProduto: 'O Link da Imagem é obrigatório.',
        dosagem: 'O campo Dosagem é obrigatório.',
        precoUnitario: 'O campo Preço Unitário é obrigatório.',
        tipoProduto: 'O Tipo de Produto é obrigatório.',
        totalEstoque: 'O Estoque é obrigatório.',
      };

      // Verifica os campos obrigatórios
      for (const campo in mensagensErro) {
        if (!req.body[campo]) {
          camposEmFalta.push(mensagensErro[campo]);
        }
      }

      // Se houver campos em falta, retorne o status 422 com as mensagens de erro
      if (camposEmFalta.length > 0) {
        return res.status(422).json({ error: camposEmFalta.join('\n') });
      }

      const data = await Produtos.create({
        usuarioId: usuarioIdBody,  //registra o id do usuario autenticado
        nomeProduto,
        nomeLab,
        imagemProduto,
        dosagem,
        descricao,
        precoUnitario,
        tipoProduto,
        totalEstoque,
      });

      return res.status(201).send({
        data,
        message: `Produto com o ID: ${data.id} e Nome: ${data.nomeProduto} cadastrado com sucesso!`,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(400).send({
        message: 'Erro ao cadastrar o Produto!',
        error: error.message,
      });
    }
  }

  async listarProdutosAdmin(req, res) {
    try {
      //*TO-DO
      //O campo usuarioId deve ser usado através do payload do JWT do usuário ADMIN

      // Verificação de autenticação JWT
      const token = req.header('Authorization');
      if (!token) {
        return res.status(401).json({ error: 'Autenticação JWT inexistente.' });
      }

      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT); // Decodifica o token
        const { tipoUsuario } = decoded; // Obtém o tipo de usuário do token decodificado
        // Verificação se o usuário é ADMIN
        if (tipoUsuario !== 'Administrador') {
          return res
            .status(403)
            .json({ error: 'Acesso negado para este tipo de usuário.' });
        }
      } catch (error) {
        return res.status(401).json({ error: 'Token JWT inválido.' });
      }
      const { nomeProduto, tipoProduto } = req.query;

      const produto = await Produtos.findAll({
        where: {
          nomeProduto: nomeProduto,
          tipoProduto: tipoProduto,
        },
        order: [['totalEstoque', 'DESC']],
      });

      if (produto.length == 0) {
        return res.status(204).send({});
      }

      return res.status(200).send({
        produto,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(400).send({
        message: 'Erro ao listar o produto!',
        error: error.message,
      });
    }
  }

  async filtrarProdutos(req, res) {
    try {
      //*TO-DO
      //O campo usuarioId deve ser usado através do payload do JWT do usuário ADMIN

      // Verificação de autenticação JWT
      const token = req.header('Authorization');
      if (!token) {
        return res.status(401).json({ error: 'Autenticação JWT inexistente.' });
      }

      const { offset, limit } = req.params;
      const { nomeProduto, tipoProduto } = req.query;

      if (limit > 20) {
        return res.status(400).json({
          message: 'O limite deve ser menor ou igual à 20',
        });
      }

      const produto = await Produtos.findAll({
        where: {
          nomeProduto: nomeProduto,
          tipoProduto: tipoProduto,
        },
        offset: offset,
        limit: limit,
        order: [['totalEstoque', 'DESC']],
      });

      if (produto.length == 0) {
        return res.status(204).send({});
      }

      return res.status(200).send({
        produto,
        'Total de produtos filtrados': produto.length,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(400).send({
        message: 'Erro ao listar o produto!',
        error: error.message,
      });
    }
  }

  async detalharProduto(req, res) {
    try {
      const token = req.header('Authorization');
      if (!token) {
        return res.status(401).json({ error: 'Autenticação JWT inexistente.' });
      }

      const { produtoId } = req.params;

      const produto = await Produtos.findOne({
        where: { id: produtoId },
      });

      if (!produto) {
        return res.status(404).send({
          message: `Produto com o ID ${produtoId} não encontrado!`,
        });
      }

      return res.status(200).send({
        produto,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(400).send({
        message: 'Erro ao listar o produto!',
        error: error.message,
      });
    }
  }

  async atualizarProduto(req, res) {
    try {
      const { produtoId } = req.params;

      const { nomeProduto, imagemProduto, dosagem, totalEstoque } = req.body;

      //Verificação de autenticação JWT
      const token = req.header('Authorization');
      if (!token) {
        return res.status(401).json({ error: 'Autenticação JWT inexistente.' });
      }

      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT); // Decodifica o token
        const { tipoUsuario } = decoded; // Obtém o tipo de usuário do token decodificado
        // Verificação se o usuário é ADMIN
        if (tipoUsuario !== 'Administrador') {
          return res
            .status(403)
            .json({ error: 'Acesso negado para este tipo de usuário.' });
        }
      } catch (error) {
        return res.status(401).json({ error: 'Token JWT inválido.' });
      }

      const produto = await Produtos.findOne({
        where: { id: produtoId },
      });

      if (!produto) {
        return res.status(404).send({
          message: `Produto com o ID ${produtoId} não encontrado!`,
        });
      }

      if (totalEstoque < 0 || !totalEstoque) {
        return res.status(422).json({
          message: 'O estoque não pode ser negativo ou nulo',
        });
      }

      if (nomeProduto === '') {
        return res.status(422).json({
          message: 'O nome do produto não pode ser vazio',
        });
      }

      if (imagemProduto === '') {
        return res.status(422).json({
          message: 'O link da imagem do produto não pode ser vazio',
        });
      }

      if (dosagem === '') {
        return res.status(422).json({
          message: 'A dosagem não pode ser vazia',
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

      return res.status(204).send({});
    } catch (error) {
      console.error(error.message);
      return res.status(400).send({
        message: 'Erro ao atualizar o Produto!',
        error: error.message,
      });
    }
  }
}

module.exports = new ProdutosController();
