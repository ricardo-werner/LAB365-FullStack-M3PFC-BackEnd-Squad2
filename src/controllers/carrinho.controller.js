const { Carrinho } = require('../models/carrinho');
const { config } = require('dotenv')
const { router } = require('../routes/carrinho.routes');
config()

class carrinhoController {
    async criarCarrinho(request, response) {
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

            const carrinho = await Carrinho.create(request.body)
            return response.status(201).json(carrinho)
        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de criar o carrinho",
                cause: message
            })
        }
    }

    async listarCarrinhos(request, response) {
        try {
            const carrinho = await Carrinho.findAll()
            return response.status(200).json(carrinho)

        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de listar o carrinho",
                cause: message
            })
        }
    }

    async listarCarrinhoId(request, response) {
        try {
            const { id } = request.params;
            const carrinho = await Carrinho.findByPk(id);

            if (!carrinho) {
                return response.status(404).json({
                    message: "Carrinho não encontrado"
                })
            }

            return response.status(200).json(carrinho)

        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de listar o carrinho",
                cause: message
            })
        }
    }

    async atualizarCarrinhoId(request, response) {
        try {
            const { id } = request.params;
            const carrinho = await Carrinho.findByPk(id);

            if (!carrinho) {
                return response.status(404).json({
                    message: "Carrinho não encontrado"
                })
            }

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

            await carrinho.update(request.body)

            return response.status(200).json(carrinho)

        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de atualizar o carrinho",
                cause: message
            })
        }
    }

    async deletarCarrinhoId(request, response) {
        try {
            const { id } = request.params;
            const carrinho = await Carrinho.findByPk(id);

            if (!carrinho) {
                return response.status(404).json({
                    message: "Carrinho não encontrado"
                })
            }

            await carrinho.destroy()

            return response.status(200).json({
                message: "Carrinho deletado com sucesso"
            })

        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return response.status(parseInt(status)).send({
                message: "Falha na operação de deletar o carrinho",
                cause: message
            })
        }
    }
}

module.exports = new carrinhoController()