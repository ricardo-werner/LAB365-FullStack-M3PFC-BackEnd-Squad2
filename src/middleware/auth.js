const { config } = require('dotenv');
const { verify } = require('jsonwebtoken');
const { Usuarios } = require('../models/usuarios');
config();

async function auth(req, res, next) {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res
        .status(401)
        .json({ error: 'Token não informado ou inválido.' });
    }

    const payload = verify(token, process.env.SECRET_KEY_JWT);

    const usuario = await Usuarios.findByPk(payload.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Anexar informações do payload(dados do usuario que estão no token)
    req.payload = payload;
    //Anexar informações do usuário(dados do usuario que estão na tabela usuarios)
    req.usuario = usuario;

    next(); // Prosseguir para o próximo middleware ou rota
  } catch (error) {
    return res.status(401).send({
      message: 'Autenticação Falhou: Token inválido ou ausente.',
      cause: error.message,
    });
  }
}

module.exports = { auth };
