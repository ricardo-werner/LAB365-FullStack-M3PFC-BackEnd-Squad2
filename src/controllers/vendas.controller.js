const { Enderecos } = require('../models/enderecos');
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
        if (!venda.quantidadeProdutoVendido) {
          venda.quantidadeProdutoVendido = 0;
        }

        // Obtenha o ID do vendedor do produto relacionado
        const produto = await Produtos.findOne({
          where: { id: venda.produtoId },
        });

        if (!produto) {
          vendasValidas = false;
          res.status(409).json({ message: 'Produto não encontrado.' });
          break; 
        }

        const vendedorId = produto.usuarioId;
        const total = venda.quantidadeProdutoVendido * produto.precoUnitario;

        if (venda.quantidadeProdutoVendido > produto.totalEstoque) {
          vendasValidas = false;
          res.status(400).json({
            message: `Não temos a quantidade solicitada para o produto: ${produto.nomeProduto} - ID:${produto.id}, Total disponível:${produto.totalEstoque}`,
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
          res.status(409).json({ message: 'Endereço do comprador não encontrado.' });
          break; 
        }

        // Crie o registro de venda
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

        // Atualize a quantidade de produtos na tabela Produtos
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

  async listarVendas(req, res) {
    try {
      const vendas = await Vendas.findAll();

      return res.status(200).send(vendas);
    } catch (error) {
      const status = error.message.status || 400;
      const message = error.message.msg || error.message;
      return res.status(parseInt(status)).send({
        message: 'Falha na operação de listar as vendas',
        cause: message,
      });
    }
  }

  async listarVendaId(req, res) {
    try {
      const { id } = req.params;

      const venda = await Vendas.findByPk(id);

      return res.status(200).send(venda);
    } catch (error) {
      const status = error.message.status || 400;
      const message = error.message.msg || error.message;
      return res.status(parseInt(status)).send({
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

      return res.status(200).send(venda);
    } catch (error) {
      const status = error.message.status || 400;
      const message = error.message.msg || error.message;
      return res.status(parseInt(status)).send({
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

      const resultado = {
        totalVendas: totalVendasResultado || 0,
        totalQuantidadeVendida: totalProdutoVendido || 0,
      };

      return res.status(200).json(resultado);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        message: 'Erro interno do servidor',
        cause: error.message,
      });
    }
  }

  // //Definir o endpoint para deletar usuário (deleção lógica)
  // async deletarVendaId(require, res) {
  //     try {
  //         const { id } = require.params;

  //         const venda = await Vendas.findByPk(id, { paranoid: true });
  //         if (!venda) {
  //             return res.status(404).send({ error: 'Venda não encontrada' });
  //         }

  //         if (venda.status === 'ativo') {
  //             venda.status = 'inativo';
  //             await venda.destroy(); // Realiza o Soft Delete
  //         }

  //         return res.status(202).send(venda);

  //     } catch (error) {
  //         const status = error.message.status || 400
  //         const message = error.message.msg || error.message
  //         return res.status(parseInt(status)).send({
  //             message: "Falha na operação de deletar venda",
  //             cause: message
  //         });
  //     }
  // }

  // //Definir o endpoint para restaurar usuário (retauração lógica)
  // async restaurarVendaId(require, res) {
  //     try {
  //         const { id } = require.params;

  //         const venda = await Vendas.findByPk(id, { paranoid: false });
  //         if (!venda) {
  //             return res.status(404).send({ error: 'Venda não encontrada' });
  //         }

  //         await venda.restore(); // Realiza o Soft Delete
  //         venda.status = 'ativo';
  //         await venda.save();

  //         return res.status(201).send(venda);

  //     } catch (error) {
  //         const status = error.message.status || 400
  //         const message = error.message.msg || error.message
  //         return res.status(parseInt(status)).send({
  //             message: "Falha na operação de restaurar venda",
  //             cause: message
  //         });
  //     }
  // }
}

module.exports = new VendasController();
