const { Carrinho } = require('../models/carrinho');
const { config } = require('dotenv')
const { router } = require('../routes/carrinho.routes');
config()

class carrinhoController {
    async criarCarrinho(req, res) {
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

            const carrinho = await Carrinho.create(req.body)
            return res.status(201).json(carrinho)
        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return res.status(parseInt(status)).send({
                message: "Falha na operação de criar o carrinho",
                cause: message
            })
        }
    }

    async listarCarrinhos(req, res) {
        try {
            const carrinho = await Carrinho.findAll()
            return res.status(200).json(carrinho)

        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return res.status(parseInt(status)).send({
                message: "Falha na operação de listar o carrinho",
                cause: message
            })
        }
    }

    async listarCarrinhoId(req, res) {
        try {
            const { id } = req.params;
            const carrinho = await Carrinho.findByPk(id);

            if (!carrinho) {
                return res.status(404).json({
                    message: "Carrinho não encontrado"
                })
            }

            return res.status(200).json(carrinho)

        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return res.status(parseInt(status)).send({
                message: "Falha na operação de listar o carrinho",
                cause: message
            })
        }
    }

    async atualizarCarrinhoId(req, res) {
        try {
            const { id } = req.params;
            const carrinho = await Carrinho.findByPk(id);

            if (!carrinho) {
                return res.status(404).json({
                    message: "Carrinho não encontrado"
                })
            }

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

            await carrinho.update(req.body)

            return res.status(200).json(carrinho)

        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return res.status(parseInt(status)).send({
                message: "Falha na operação de atualizar o carrinho",
                cause: message
            })
        }
    }

    async deletarCarrinhoId(req, res) {
        try {
            const { id } = req.params;
            const carrinho = await Carrinho.findByPk(id);

            if (!carrinho) {
                return res.status(404).json({
                    message: "Carrinho não encontrado"
                })
            }

            await carrinho.destroy()

            return res.status(200).json({
                message: "Carrinho deletado com sucesso"
            })

        } catch (error) {
            const status = error.message.status || 400
            const message = error.message.msg || error.message
            return res.status(parseInt(status)).send({
                message: "Falha na operação de deletar o carrinho",
                cause: message
            })
        }
    }
}

module.exports = new carrinhoController()