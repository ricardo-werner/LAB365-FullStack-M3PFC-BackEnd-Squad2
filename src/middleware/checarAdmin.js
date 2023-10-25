async function checarAdmin(req, res, next) {
  try {
    if (req.payload.tipoUsuario !== 'Administrador') {
      return res
        .status(403)
        .json({ error: 'Acesso negado para este tipo de usuário.' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

module.exports = { checarAdmin };
