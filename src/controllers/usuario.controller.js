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
      if (
        !enderecoId ||
        !cep ||
        !logradouro ||
        !numero ||
        !bairro ||
        !cidade ||
        !estado || //campos de endereço obrigatórios
        !nomeCompleto ||
        !cpf ||
        !dataNascimento ||
        !telefone ||
        !email ||
        !senha ||
        !tipoUsuario
      ) {
        //campos de usuario obrigatórios
        return res.status(422).json({
          error: "Todos os campos obrigatórios devem ser preenchidos.",
        });
      }

      // Verifica se o email já está cadastrado
      const emailExiste = await Usuario.findOne({ where: { email: email } });
      if (emailExiste) {
        return res.status(409).json({ error: "Email já cadastrado." });
      }

      // Verifica se o cpf já está cadastrado
      const cpfExiste = await Usuario.findOne({ where: { cpf: cpf } });
      if (cpfExiste) {
        return res.status(409).json({ error: "CPF já cadastrado." });
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        // Verifica o formato do email
        return res
          .status(400)
          .json("O campo email está em um formato inválido.");
      }
      if (!/^\d{10}$/.test(telefone)) {
        // Verifica o formato do telefone
        return res
          .status(400)
          .json("O campo telefone está em um formato inválido.");
      } else if (!/^[0-9]+$/.test(telefone)) {
        // Verifica se há apenas números
        return res
          .status(400)
          .json("O campo telefone deve conter apenas números.");
      }

      if (!/^\d{11}$/.test(cpf)) {
        // Verifica o formato do cpf
        return res.status(400).json("O campo cpf está em um formato inválido.");
      } else if (!/^[0-9]+$/.test(cpf)) {
        // Verifica se há apenas números
        return res.status(400).json("O campo CPF deve conter apenas números.");
      }

      if (
        senha.length < 8 ||
        !/[a-z]/.test(senha) || // Pelo menos uma letra minúscula
        !/[A-Z]/.test(senha) || // Pelo menos uma letra maiúscula
        !/\d/.test(senha) || // Pelo menos um número
        !/[@#$%^&+=]/.test(senha) // Pelo menos um caracter especial
      ) {
        return res
          .status(400)
          .json("O campo senha está em um formato inválido.");
      }

      //Adiciona o endereço no BD
      const endereco = await Endereco.create({
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        complemento,
        latitude,
        longitude,
      });

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
