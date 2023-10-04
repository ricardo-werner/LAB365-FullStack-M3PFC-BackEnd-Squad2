const { Enderecos } = require('../models/enderecos');

class TestController {
  async criarEndereco(req, res) {
    try {
      const {
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        complemento,
        lat,
        long,
      } = req.body;

      const novoEndereco = await Enderecos.create({
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        complemento,
        lat,
        long,
      });

      res.status(201).json(novoEndereco);
    } catch (error) {
      console.error('Erro ao cadastrar endereço:', error);
      res.status(500).json({ mensagem: 'Erro ao cadastrar endereço.' });
    }
  }
}
module.exports = new TestController();
