const { Pedido } = require('../models/pedido');
const { config } = require('dotenv')
config()

class pedidoController {
    async criarPedido(req, res) {
        try {
            const {
                produto_id,
                quantidade,
                preco,
                total
            } = req.body;

            if (!produto_id || !quantidade || !preco || !total) {
                return res.status(400).json({
                    message: "Dados obrigatórios não foram preenchidos"
                })
            }

            const pedido = await Pedido.create(req.body)
            return res.status(201).json(pedido)
        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return res.status(parseInt(status)).send({
                message: "Falha na operação de criar o pedido",
                cause: message
            })
        }
    }

    async listarPedidos(req, res) {
        try {
            const pedido = await Pedido.findAll()
            return res.status(200).json(pedido)

        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return res.status(parseInt(status)).send({
                message: "Falha na operação de listar os pedidos",
                cause: message
            })
        }
    }

    async listarPedidoId(req, res) {
        try {
            const { id } = req.params;
            const pedido = await Pedido.findByPk(id);

            if (!pedido) {
                return res.status(404).json({
                    message: "Pedido não encontrado"
                })
            }

            return res.status(200).json(pedido)

        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return res.status(parseInt(status)).send({
                message: "Falha na operação de listar o pedido",
                cause: message
            })
        }
    }    

    async deletarPedidoId(req, res) {
        try {
            const { id } = req.params;
            const pedido = await Pedido.findByPk(id);

            if (!carrinho) {
                return res.status(404).json({
                    message: "Pedido não encontrado"
                })
            }

            await pedido.destroy()

            return res.status(200).json({
                message: "Pedido deletado com sucesso"
            })

        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return res.status(parseInt(status)).send({
                message: "Falha na operação de deletar o pedido",
                cause: message
            })
        }
    }
}

module.exports = new pedidoController()