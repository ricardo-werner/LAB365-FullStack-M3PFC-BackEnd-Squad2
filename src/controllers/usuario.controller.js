class UsuarioController {
  async adicionarUsuario(req, res) {
    try {
      const {
        enderecoId,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        complemento,
        latitude,
        longitude,
        nomeCompleto,
        cpf,
        dataNascimento,
        telefone,
        email,
        senha,
        criadoPor,
        tipoUsuario,
      } = req.body;

// Verifica se os campos obrigatórios estão ausentes ou vazios
if (!enderecoId || !cep || !logradouro || !numero || !bairro || !cidade || !estado || //campos de endereço obrigatórios
!nomeCompleto || !cpf || !dataNascimento || !telefone || !email || !senha || !tipoUsuario) { //campos de usuario obrigatórios
    return res.status(422).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  // Verifica se o email já está cadastrado
  const emailExiste = await Usuario.findOne({ where: { email: email } });
  if (emailExiste) {  
      return res.status(409).json({ error: 'Email já cadastrado.' });
  }

  // Verifica se o cpf já está cadastrado
  const cpfExiste = await Usuario.findOne({ where: { cpf: cpf } });
  if (cpfExiste) {
      return res.status(409).json({ error: 'CPF já cadastrado.' });
  }

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
