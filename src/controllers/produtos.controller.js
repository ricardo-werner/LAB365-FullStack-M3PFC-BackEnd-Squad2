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
          message:
            'Você não tem permissão para cadastrar um produto para outro usuário.',
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
        usuarioId: usuarioIdBody, //registra o id do usuario autenticado
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
      // Obter os parâmetros de consulta da URL
      const { offset, limit, name, typeProduct, order } = req.query;
      const adminId = req.usuario.id; // Obter o ID do usuário ADMIN do token JWT
  
      // Verificar se o usuário é um ADMIN com base no ID
      if (adminId !== null) {
        // Construir as opções para a consulta
        const options = {
          where: {
            usuarioId: adminId, // Filtre com base no ID do usuário ADMIN
          },
          order: [['totalEstoque', order === 'asc' ? 'ASC' : 'DESC']], // Configurar a ordenação com base no parâmetro 'order'
        };
  
        // Aplicar os filtros, se fornecidos
        if (name) {
          options.where.nomeProduto = name;
        }
        if (typeProduct) {
          options.where.tipoProduto = typeProduct;
        }
  
        // Aplicar a paginação
        if (offset && limit) {
          options.offset = parseInt(offset, 10);
          options.limit = Math.min(parseInt(limit, 10), 20);
        }
  
        // Realizar a consulta com as opções configuradas
        const produtos = await Produtos.findAndCountAll(options);
  
        if (produtos.count === 0) {
          return res.status(204).json({});
        }
  
        return res.status(200).json({
          produtos: produtos.rows,
          total: produtos.count,
        });
      } else {
        return res.status(403).json({ message: 'Acesso negado. Acesso somente para Administradores.' });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(400).json({
        message: 'Erro ao listar os produtos',
        error: error.message,
      });
    }
  }
  

  async filtrarProdutos(request, response) {
    try {
      const { offset, limit } = request.params;
      const { nomeProduto, tipoProduto, ordem } = request.query;

      if (limit > 20) {
        return response.status(400).json({
          message: 'O limite deve ser menor ou igual à 20',
        });
      }

      const whereClause = {};

      if (nomeProduto) {
        whereClause.nomeProduto = nomeProduto;
      }

      if (tipoProduto) {
        whereClause.tipoProduto = tipoProduto;
      }

      const ordenar = [];

      if (ordem === 'asc') {
        ordenar.push(['totalEstoque', 'ASC']);
      } else if (ordem === 'desc') {
        ordenar.push(['totalEstoque', 'DESC']);
      }

      // Verifique o ID do usuário administrador com base no token JWT
      const usuario = request.usuario;
      console.log(usuario, 'aaaaa');
      if (!usuario || usuario.tipoUsuario !== 'Administrador') {
        return response.status(403).json({
          message: 'Acesso negado para este tipo de usuário.',
        });
      }

      // Agora você pode adicionar o ID do usuário ao whereClause
      whereClause.usuarioId = usuario.id;
      const produtos = await Produtos.findAll({
        where: whereClause,
        offset: offset,
        limit: limit,
        order: ordenar,
      });

      if (produtos.length == 0) {
        return response.status(204).send({});
      }

      return response.status(200).send({
        produtos,
        'Total de produtos filtrados': produtos.length,
      });
    } catch (error) {
      console.error(error.message);
      return response.status(400).send({
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
