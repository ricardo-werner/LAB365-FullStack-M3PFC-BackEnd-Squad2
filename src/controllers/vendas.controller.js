const { Vendas } = require('../models/vendas')
const { senha } = require('../models/usuarios')
const { SECRET_KEY_JWT } = require('../config/database.config')
const { config } = require('dotenv')
const { sign } = require('jsonwebtoken')
const { response } = require('express')
const bcrypt = require('bcrypt');
config()

class VendasController {
    async listAllVendas(request, response) {
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

    async listOneVendasId(request, response) {
        try {
            const { id } = request.params

            const vendas = await Vendas.findByPk(id)

            return response.status(200).send(vendas)
        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de listar a venda",
                cause: message
            })
        }
    }

    async createOneVendas(request, response) {
        try {
            const { id_usuario, id_produto, quantidade, valor_total } = request.body

            const vendas = await Vendas.create({ id_usuario, id_produto, quantidade, valor_total })

            return response.status(200).send(vendas)
        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de criar a venda",
                cause: message
            })
        }
    }

    async updateOneVendas(request, response) {
        try {
            const { id } = request.params
            const { id_usuario, id_produto, quantidade, valor_total } = request.body

            const vendas = await Vendas.findByPk(id)

            vendas.id_usuario = id_usuario
            vendas.id_produto = id_produto
            vendas.quantidade = quantidade
            vendas.valor_total = valor_total

            await vendas.save()

            return response.status(200).send(vendas)
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
    // async deleteOneVendas(require, response) {
    //     try {
    //         const { id } = require.params;

    //         const vendas = await Vendas.findByPk(id, { paranoid: true });
    //         if (!vendas) {
    //             return response.status(404).send({ error: 'Venda não encontrada' });
    //         }

    //         if (vendas.status === 'ativo') {
    //             vendas.status = 'inativo';
    //             await vendas.destroy(); // Realiza o Soft Delete
    //         }

    //         return response.status(200).send(vendas);

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
    // async restoreOneVenda(require, response) {
    //     try {
    //         const { id } = require.params;

    //         const venda = await Vendas.findByPk(id, { paranoid: false });
    //         if (!venda) {
    //             return response.status(404).send({ error: 'Venda não encontrada' });
    //         }

    //         await venda.restore(); // Realiza o Soft Delete
    //         venda.status = 'ativo';
    //         await venda.save();

    //         return response.status(200).send(venda);

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