const { Produto } = require("../models/produtos");
const { config } = require("dotenv");
config();

class ProdutosController {
  async cadastrarMedicamento(request, response) {
    try {
      const {
        userId,
        name,
        labName,
        imageLink,
        dosage,
        unitPrice,
        typeProduct,
        totalStock,
      } = request.body;

      console.log(request.body);

      if (
        !userId ||
        !name ||
        !labName ||
        !imageLink ||
        !dosage ||
        !unitPrice ||
        !typeProduct ||
        !totalStock
      ) {
        return response.status(422).send({
          message:
            "Todos os campos são obrigatórios!",
        });
      }

      const produto = await Produto.findOne({ where: { name } });
      if (produto) {
        return response.status(409).send({
          message: "Já existe um remédio com esse nome cadastrado no sistema!",
        });
      }

      if (unitPrice <= 0) {
        return res.status(400).json({
          message:
            "O preço deve ser maior que zero",
        });
      }

      if (totalStock < 0) {
        return res.status(400).json({
          message:
            "O estoque não pode ser negativo",
        });
      }

      if (typeProduct != "Medicamento controlado" || typeProduct != "Medicamento não controlado") {
        return res.status(400).json({
          message: "Tipo de Produto em formato inválido!",
        });
      }

      const data = await Produto.create({
        userId,
        name,
        labName,
        imageLink,
        dosage,
        unitPrice,
        typeProduct,
        totalStock,
      });

      return response.status(201).send({
        data,
        message: `Produto com o ID: ${data.id} e Nome: ${data.name} cadastrado com sucesso!`,
      });
    } catch (error) {
      console.error(error.message);
      return response.status(400).send({
        message: "Erro ao cadastrar o remedio!",
        error: error.message,
      });
    }
  }
}

module.exports = new ProdutosController();
