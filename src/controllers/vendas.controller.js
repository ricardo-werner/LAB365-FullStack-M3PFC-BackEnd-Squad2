const { Produtos } = require('../models/produtos');
const { UsuariosEnderecos } = require('../models/usuariosEnderecos');
const { Vendas } = require('../models/vendas');
const { config } = require('dotenv');
config();

class VendasController {
  async criarVenda(req, res) {
    let vendasValidas = true;

    try {
      const vendas = req.body;
      const compradorId = req.usuario.id;

      for (const venda of vendas) {
        if (
          !venda.produtoId ||
          !venda.quantidadeProdutoVendido ||
          !venda.tipoPagamento
        ) {
          return res
            .status(422)
            .json({ message: 'Campos obrigatórios não foram fornecidos.' });
        }

        if (!venda.quantidadeProdutoVendido) {
          venda.quantidadeProdutoVendido = 0;
        }

        const produto = await Produtos.findOne({
          where: { id: venda.produtoId },
        });

        if (!produto) {
          vendasValidas = false;
          res.status(409).json({ message: 'Produto não encontrado.' });
          break;
        }

        const vendedorId = produto.usuarioId;

        if (vendedorId === compradorId) {
          vendasValidas = false;
          res.status(400).json({
            message:
              'Administradores (vendedores) não podem comprar seus próprios produtos.',
          });
          break;
        }

        const total = venda.quantidadeProdutoVendido * produto.precoUnitario;

        if (venda.quantidadeProdutoVendido > produto.totalEstoque) {
          vendasValidas = false;
          res.status(409).json({
            message: `${produto.nomeProduto} quantidade disponível em estoque: ${produto.totalEstoque}`,
            estoqueDisponivel: produto.totalEstoque,
          });
          break;
        }

        const tipoPagamento = venda.tipoPagamento;
        if (
          ![
            'cartão de crédito',
            'cartão de débito',
            'pix',
            'boleto',
            'transferência bancária',
          ].includes(tipoPagamento)
        ) {
          vendasValidas = false;
          res.status(400).json({ message: 'Tipo de pagamento inválido.' });
          break;
        }

        const usuariosEnderecos = await UsuariosEnderecos.findOne({
          where: { usuarioId: compradorId },
        });

        if (!usuariosEnderecos) {
          vendasValidas = false;
          res
            .status(409)
            .json({ message: 'Endereço do comprador não encontrado.' });
          break;
        }

        await Vendas.create({
          compradorId: compradorId,
          vendedorId: vendedorId,
          produtoId: venda.produtoId,
          usuariosEnderecosId: usuariosEnderecos.id,
          precoUnitario: produto.precoUnitario,
          quantidadeProdutoVendido: venda.quantidadeProdutoVendido,
          total,
          tipoPagamento: tipoPagamento,
        });

        await Produtos.update(
          {
            totalEstoque: produto.totalEstoque - venda.quantidadeProdutoVendido,
          },
          {
            where: { id: venda.produtoId },
          }
        );
      }

      if (vendasValidas) {
        return res
          .status(201)
          .json({ message: 'Registros de venda criados com sucesso.' });
      }
    } catch (error) {
      const status = error.message.status || 400;
      const message = error.message.msg || error.message;
      return res.status(parseInt(status)).send({
        message: 'Falha na operação de criar uma venda',
        cause: message,
      });
    }
  }

  async listarCompras(req, res) {
    try {
      const usuarioId = req.usuario.id;

      const compras = await Vendas.findAll({
        where: { compradorId: usuarioId },
        include: { model: Produtos },
      });

      if (!compras || compras.length === 0) {
        return res
          .status(404)
          .json({ message: 'Você ainda não tem compras conosco.' });
      }

      return res.status(200).json(compras);
    } catch (error) {
      const status = error.message.status || 400;
      const message = error.message.msg || error.message;
      return res.status(parseInt(status)).json({
        message: 'Falha na operação de listar as compras',
        cause: message,
      });
    }
  }

  async listarVendaAdmin(req, res) {
    try {
      const usuarioId = req.usuario.id;

      const vendas = await Vendas.findAll({
        where: { vendedorId: usuarioId },
        include: { model: Produtos },
      });

      if (!vendas || vendas.length === 0) {
        return res.status(404).json({
          message: 'Você ainda não tem nenuma venda registrada.',
        });
      }

      return res.status(200).json(vendas);
    } catch (error) {
      const status = error.message.status || 400;
      const message = error.message.msg || error.message;
      return res.status(parseInt(status)).json({
        message: 'Falha na operação de listar a venda',
        cause: message,
      });
    }
  }

  async atualizarVendaId(req, res) {
    try {
      const { id } = req.params;
      const {
        nome_produto,
        nome_lab,
        dosagem,
        descricao,
        preço_unitario,
        tipo_produto,
        quantidade,
        valor_total,
      } = req.body;

      const venda = await Vendas.findByPk(id);

      venda.nome_produto = nome_produto;
      venda.nome_lab = nome_lab;
      venda.dosagem = dosagem;
      venda.descricao = descricao;
      venda.preço_unitario = preço_unitario;
      venda.tipo_produto = tipo_produto;
      venda.quantidade = quantidade;
      venda.valor_total = valor_total;

      await venda.save();

      return res.status(200).json(venda);
    } catch (error) {
      const status = error.message.status || 400;
      const message = error.message.msg || error.message;
      return res.status(parseInt(status)).json({
        message: 'Falha na operação de atualizar a venda',
        cause: message,
      });
    }
  }

  async vendasAdminDashboard(req, res) {
    try {
      const adminId = req.usuario.id;
      const totalVendasResultado = await Vendas.sum('total', {
        where: {
          vendedorId: adminId,
        },
      });

      const totalProdutoVendido = await Vendas.sum('quantidadeProdutoVendido', {
        where: {
          vendedorId: adminId,
        },
      });

      const produtosEmEstoque = await Produtos.findAll({
        attributes: [
          'id',
          'nomeProduto',
          'precoUnitario',
          'nomeLab',
          'totalEstoque',
        ],
      });

      const resultado = {
        totalVendas: totalVendasResultado || 0,
        totalQuantidadeVendida: totalProdutoVendido || 0,
        produtosEmEstoque,
      };

      return res.status(200).json(resultado);
    } catch (error) {
      console.error(error.message);
      return res.status().json({
        message: 'Erro interno do servidor',
        cause: error.message,
      });
    }
  }
}

module.exports = new VendasController();
