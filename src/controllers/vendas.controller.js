const { Vendas } = require('../models/vendas')
const { config } = require('dotenv')
config()

class VendasController {
    async criarVenda(request, response) {
        try {
            const {
                usuario_id,
                produto_id,
                vendedor_id,
                comprador_id,
                nome_produto,
                nome_lab,
                dosagem,
                descricao,
                preço_unitario,
                tipo_produto,
                quantidade,
                valor_total } = request.body

            const venda = await Vendas.create({
                usuario_id,
                produto_id,
                vendedor_id,
                comprador_id,
                nome_produto,
                nome_lab,
                dosagem,
                descricao,
                preço_unitario,
                tipo_produto,
                quantidade,
                valor_total
            })

            return response.status(201).send(venda)
        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de criar uma venda",
                cause: message
            })
        }
    }

    async listarVendas(request, response) {
        try {
            const vendas = await Vendas.findAll()

            return response.status(200).send(vendas)
        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de listar as vendas",
                cause: message
            })
        }
    }

    async listarVendaId(request, response) {
        try {
            const { id } = request.params

            const venda = await Vendas.findByPk(id)

            return response.status(200).send(venda)
        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de listar a venda",
                cause: message
            })
        }
    }

    async atualizarVendaId(request, response) {
        try {
            const { id } = request.params
            const {
                nome_produto,
                nome_lab,
                dosagem,
                descricao,
                preço_unitario,
                tipo_produto,
                quantidade,
                valor_total } = request.body

            const venda = await Vendas.findByPk(id)

            venda.nome_produto = nome_produto
            venda.nome_lab = nome_lab
            venda.dosagem = dosagem
            venda.descricao = descricao
            venda.preço_unitario = preço_unitario
            venda.tipo_produto = tipo_produto
            venda.quantidade = quantidade
            venda.valor_total = valor_total

            await venda.save()

            return response.status(200).send(venda)
        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de atualizar a venda",
                cause: message
            })
        }
    }


    // //Definir o endpoint para deletar usuário (deleção lógica)
    // async deletarVendaId(require, response) {
    //     try {
    //         const { id } = require.params;

    //         const venda = await Vendas.findByPk(id, { paranoid: true });
    //         if (!venda) {
    //             return response.status(404).send({ error: 'Venda não encontrada' });
    //         }

    //         if (venda.status === 'ativo') {
    //             venda.status = 'inativo';
    //             await venda.destroy(); // Realiza o Soft Delete
    //         }

    //         return response.status(202).send(venda);

    //     } catch (error) {
    //         const status = error.message.status || 400
    //         const message = error.message.msg || error.message
    //         return response.status(parseInt(status)).send({
    //             message: "Falha na operação de deletar venda",
    //             cause: message
    //         });
    //     }
    // }

    // //Definir o endpoint para restaurar usuário (retauração lógica)
    // async restaurarVendaId(require, response) {
    //     try {
    //         const { id } = require.params;

    //         const venda = await Vendas.findByPk(id, { paranoid: false });
    //         if (!venda) {
    //             return response.status(404).send({ error: 'Venda não encontrada' });
    //         }

    //         await venda.restore(); // Realiza o Soft Delete
    //         venda.status = 'ativo';
    //         await venda.save();

    //         return response.status(201).send(venda);

    //     } catch (error) {
    //         const status = error.message.status || 400
    //         const message = error.message.msg || error.message
    //         return response.status(parseInt(status)).send({
    //             message: "Falha na operação de restaurar venda",
    //             cause: message
    //         });
    //     }
    // }
}

module.exports = new VendasController()