const { config } = require('dotenv');
const { verify } = require('jsonwebtoken');
const { Usuarios } = require('../models/usuarios');
config();

async function auth(req, res, next) {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ error: 'Token não informado ou inválido.' });
    }

    const payload = verify(token, process.env.SECRET_KEY_JWT);

    const usuario = await Usuarios.findByPk(payload.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }


    req.payload = payload;
    req.usuario = usuario;

    next(); 
  } catch (error) {
    return res.status(401).send({
      message: 'Autenticação Falhou: Token inválido ou ausente.',
      cause: error.message,
    });
  }
}

module.exports = { auth };
