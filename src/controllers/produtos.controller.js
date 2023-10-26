const { Op } = require('sequelize');
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

      const existeProdutoLabMesmoUsuario = await Produtos.findOne({
        where: { nomeProduto: nomeProduto, nomeLab: nomeLab },
      });
      if (existeProdutoLabMesmoUsuario) {
        return res.status(409).json({
          error:
            'Já existe um medicamento com esse Nome e Laboratório cadastrado para esse usuário.',
        });
      }

      const usuarioAutenticadoId = req.usuario.id;

      const usuarioIdBody = req.body.usuarioId || usuarioAutenticadoId;

      if (usuarioIdBody !== usuarioAutenticadoId) {
        return res.status(403).json({
          message:
            'Você não tem permissão para cadastrar um produto para outro usuário.',
        });
      }

      const tiposPermitidos = ['Controlado', 'Não Controlado'];
      if (!tiposPermitidos.includes(tipoProduto)) {
        return res.status(400).json({
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

      const camposEmFalta = [];

      const mensagensErro = {
        nomeProduto: 'O Nome do Produto é obrigatório.',
        nomeLab: 'O Nome do Laboratório é obrigatório.',
        imagemProduto: 'O Link da Imagem é obrigatório.',
        dosagem: 'O campo Dosagem é obrigatório.',
        precoUnitario: 'O campo Preço Unitário é obrigatório.',
        tipoProduto: 'O Tipo de Produto é obrigatório.',
        totalEstoque: 'O Estoque é obrigatório.',
      };

      for (const campo in mensagensErro) {
        if (!req.body[campo]) {
          camposEmFalta.push(mensagensErro[campo]);
        }
      }

      if (camposEmFalta.length > 0) {
        return res.status(422).json({ error: camposEmFalta.join('\n') });
      }

      const data = await Produtos.create({
        usuarioId: usuarioIdBody,
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
      const { offset, limit } = req.params;
      const { nomeProduto, tipoProduto, ordem } = req.query;

      const options = {
        where: { usuarioId: req.usuario.id },
        order: [['totalEstoque', ordem === 'asc' ? 'ASC' : 'DESC']],
      };

      const filtrar = {};

      if (nomeProduto) {
        filtrar.nomeProduto = { [Op.iLike]: `%${nomeProduto}%` };
      }
      if (tipoProduto) {
        filtrar.tipoProduto = tipoProduto;

        filtrar.usuarioId = req.usuario.id;
      }

      options.where = filtrar;

      if (offset && limit) {
        options.offset = Math.max(parseInt(offset, 10), 0);
        options.limit = Math.min(parseInt(limit, 10), 20);
      }

      const produtos = await Produtos.findAndCountAll(options);

      if (produtos.count === 0) {
        return res.status(204).json({});
      }

      return res.status(200).json({
        produtos: produtos.rows,
        total: produtos.count,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao listar os produtos',
        error: error.message,
      });
    }
  }

  async filtrarProdutos(req, res) {
    try {
      const { offset, limit } = req.params;
      const { nomeProduto, tipoProduto, ordem } = req.query;

      const consultar = {
        limit: Math.min(20, parseInt(limit)),
        offset: parseInt(offset),
      };
      if (nomeProduto) {
        consultar.where = {
          nomeProduto: { [Op.iLike]: `%${nomeProduto}%` },
        };
      } else {
        if (tipoProduto) {
          consultar.where = {
            tipoProduto: tipoProduto,
          };
        }
      }

      const whereClause = {};

      if (nomeProduto) {
        whereClause.nomeProduto = nomeProduto;
      }

      if (tipoProduto) {
        whereClause.tipoProduto = tipoProduto;
      }

      if (ordem === 'asc') {
        consultar.order = [['totalEstoque', 'ASC']];
      } else {
        consultar.order = [['totalEstoque', 'DESC']];
      }

      const totalProdutosRegistrados = await Produtos.count();

      const produtos = await Produtos.findAll(consultar);
      if (!produtos || produtos.length === 0) {
        return res
          .status(204)
          .json({ message: 'Nenhum resultado encontrado.' });
      }

      return res.status(200).json({
        message: 'Total de produtos filtrados:',
        contar: totalProdutosRegistrados,
        resultado: produtos,
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
      return res.status(500).send({
        message: 'Erro ao listar o produto!',
        error: error.message,
      });
    }
  }

  async atualizarProduto(req, res) {
    try {
      const { produtoId } = req.params;

      const { nomeProduto, imagemProduto, dosagem, totalEstoque } = req.body;

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

      const estoqueAtual = produto.totalEstoque || 0; 
      const novoEstoque = estoqueAtual + parseInt(totalEstoque);

      await Produtos.update(
        {
          nomeProduto,
          imagemProduto,
          dosagem,
          totalEstoque: novoEstoque,
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
