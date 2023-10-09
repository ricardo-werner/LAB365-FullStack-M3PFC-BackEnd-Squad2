async function checarAdmin(req, res, next) {
  try {
    // Verifique se o tipo de usuário é 'Administrador'
    if (req.payload.tipoUsuario !== 'Administrador') {
      return res.status(403).json({ error: 'Acesso negado para este tipo de usuário.' });
    }

    // Se o tipo de usuário for 'Administrador', prossiga para a próxima etapa
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

module.exports = { checarAdmin };
