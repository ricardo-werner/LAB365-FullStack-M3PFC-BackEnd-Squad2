class UsuarioController {
  async adicionarUsuario(req, res) {
    try {
      const {
        enderecoId,
        nomeCompleto,
        cpf,
        dataNascimento,
        telefone,
        email,
        senha,
        criadoPor,
        tipoUsuario,
      } = req.body;
      const usuario = await Usuario.create({
        enderecoId,
        nomeCompleto,
        cpf,
        dataNascimento,
        telefone,
        email,
        senha,
        criadoPor,
        tipoUsuario,
      });

      return res
      .status(201)
      .send({ data: "Usuario salvo com sucesso!", usuario: usuario });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}
