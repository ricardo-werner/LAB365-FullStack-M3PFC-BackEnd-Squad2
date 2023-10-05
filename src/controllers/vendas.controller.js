const { Vendas } = require('../models/vendas')
const { senha } = require('../models/usuarios')
const { SECRET_KEY_JWT } = require('../config/database.config')
const { config } = require('dotenv')
const { sign } = require('jsonwebtoken')
const { response } = require('express')
const bcrypt = require('bcrypt');
config()

class VendasController {
    async createOneVenda(request, response) {
        try {
            const { id_usuario, id_produto, quantidade, valor_total } = request.body

            const venda = await Vendas.create({ id_usuario, id_produto, quantidade, valor_total })

            return response.status(200).send(venda)
        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de criar uma venda",
                cause: message
            })
        }
    }

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

    async listOneVenda(request, response) {
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

    async createOneVenda(request, response) {
        try {
            const { id_usuario, id_produto, quantidade, valor_total } = request.body

            const venda = await Vendas.create({ id_usuario, id_produto, quantidade, valor_total })

            return response.status(200).send(venda)
        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de criar a venda",
                cause: message
            })
        }
    }

    async updateOneVenda(request, response) {
        try {
            const { id } = request.params
            const { id_usuario, id_produto, quantidade, valor_total } = request.body

            const venda = await Vendas.findByPk(id)

            venda.id_usuario = id_usuario
            venda.id_produto = id_produto
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
    // async deleteOneVenda(require, response) {
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

    //         return response.status(200).send(venda);

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