const { config } = require('dotenv');
const { verify } = require('jsonwebtoken');
config();

async function auth(request, response, next) {
  try {
    const { authorization } = request.headers;
    if (!authorization) {
      return response.status(401).send({
        message: 'Autenticação Falhou',
        cause: 'Token não informado',
      });
    }

    const payload = verify(authorization, process.env.SECRET_KEY_JWT);

    if (payload.tipoUsuario !== 'Administrador') {
      return response.status(403).json({
        message: 'Acesso negado para este tipo de usuário.',
      });
    }

    request.payload = payload;
    next();
  } catch (error) {
    return response.status(401).send({
      message: 'Autenticação Falhou',
      cause: error.message,
    });
  }
}

module.exports = { auth };
