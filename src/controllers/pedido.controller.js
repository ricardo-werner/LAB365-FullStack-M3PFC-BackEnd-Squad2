const { Pedido } = require('../models/pedido');
const { config } = require('dotenv')
config()

class pedidoController {
    async criarPedido(request, response) {
        try {
            const {
                produto_id,
                quantidade,
                preco,
                total
            } = request.body;

            if (!produto_id || !quantidade || !preco || !total) {
                return response.status(400).json({
                    message: "Dados obrigatórios não foram preenchidos"
                })
            }

            const pedido = await Pedido.create(request.body)
            return response.status(201).json(pedido)
        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de criar o pedido",
                cause: message
            })
        }
    }

    async listarPedidos(request, response) {
        try {
            const pedido = await Pedido.findAll()
            return response.status(200).json(pedido)

        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de listar os pedidos",
                cause: message
            })
        }
    }

    async listarPedidoId(request, response) {
        try {
            const { id } = request.params;
            const pedido = await Pedido.findByPk(id);

            if (!pedido) {
                return response.status(404).json({
                    message: "Pedido não encontrado"
                })
            }

            return response.status(200).json(pedido)

        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de listar o pedido",
                cause: message
            })
        }
    }    

    async deletarPedidoId(request, response) {
        try {
            const { id } = request.params;
            const pedido = await Pedido.findByPk(id);

            if (!carrinho) {
                return response.status(404).json({
                    message: "Pedido não encontrado"
                })
            }

            await pedido.destroy()

            return response.status(200).json({
                message: "Pedido deletado com sucesso"
            })

        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de deletar o pedido",
                cause: message
            })
        }
    }
}

module.exports = new pedidoController()