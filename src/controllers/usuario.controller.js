const { Usuarios } = require("../models/usuarios");
const { Enderecos } = require("../models/enderecos");
const { UsuariosEnderecos } = require("../models/usuariosEnderecos");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class UsuarioController {
  async login(req, res) {
    const { email, senha } = req.body;
    try {
      if (!email || !senha) {
        return res
          .status(401)
          .json({ error: "E-mail e senha devem ser preenchidos." });
      }
      const usuario = await Usuarios.findOne({ where: { email: email } });
      if (!usuario) {
        return res.status(401).json({ error: "E-mail não encontrado." });
      }
      const senhaValida = await bcrypt.compare(senha, usuario.senha); // Compara a senha informada com a senha criptografada no BD
      if (!senhaValida) {
        return res.status(401).json({ error: "Senha inválida." });
      }
      const token = jwt.sign(
        {
          id: usuario.id,
          tipoUsuario: usuario.tipoUsuario,
          email: usuario.email,
          nomeCompleto: usuario.nomeCompleto,
        },
        process.env.SECRET_KEY_JWT,
        { expiresIn: "1d" }
      );
      return res
        .status(200)
        .send({ msg: "Usuario logado com sucesso!", token: token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  // Método para adicionar um usuário COMPRADOR
  async adicionarUsuarioComprador(req, res) {
    try {
      const {
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
      } = req.body;

      // Verifica se os campos obrigatórios estão ausentes ou vazios
      const camposEmFalta = [];
      // Objeto com mensagens de erro personalizadas
      const mensagensErro = {
        cep: "O campo CEP é obrigatório.",
        logradouro: "O campo Logradouro é obrigatório.",
        numero: "O campo Número é obrigatório.",
        bairro: "O campo Bairro é obrigatório.",
        cidade: "O campo Cidade é obrigatório.",
        estado: "O campo Estado é obrigatório.",
        nomeCompleto: "O campo Nome Completo é obrigatório.",
        cpf: "O campo CPF é obrigatório.",
        dataNascimento: "O campo Data de Nascimento é obrigatório.",
        telefone: "O campo Telefone é obrigatório.",
        email: "O campo Email é obrigatório.",
        senha: "O campo Senha é obrigatório.",
      };

      // Verifica os campos obrigatórios
      for (const campo in mensagensErro) {
        if (!req.body[campo]) {
          camposEmFalta.push(mensagensErro[campo]);
        }
      }

      // Se houver campos em falta, retorne o status 422 com as mensagens de erro
      if (camposEmFalta.length > 0) {
        return res.status(422).json({ error: camposEmFalta.join("\n") });
      }
      // Verifica se o email já está cadastrado
      const emailExiste = await Usuarios.findOne({ where: { email: email } });
      if (emailExiste) {
        return res.status(409).json({ error: "Email já cadastrado." });
      }

      // Verifica se o cpf já está cadastrado
      const cpfExiste = await Usuarios.findOne({ where: { cpf: cpf } });
      if (cpfExiste) {
        return res.status(409).json({ error: "CPF já cadastrado." });
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        // Verifica o formato do email
        return res
          .status(400)
          .json("O campo email está em um formato inválido.");
      }
      // Verifica o formato do telefone
      if (!/^\d{8,10}$/.test(telefone)) {
        return res
          .status(400)
          .json("O campo telefone está em um formato inválido.");
      }

      // Verifica se há apenas números no telefone
      if (!/^[0-9]+$/.test(telefone)) {
        return res
          .status(400)
          .json("O campo telefone deve conter apenas números.");
      }

      // Verifica o formato do CPF
      if (!/^\d{11}$/.test(cpf)) {
        return res.status(400).json("O campo CPF está em um formato inválido.");
      }

      // Verifica se há apenas números no CPF
      if (!/^[0-9]+$/.test(cpf)) {
        return res.status(400).json("O campo CPF deve conter apenas números.");
      }

      if (
        senha.length < 8 || //Não pode ser senha com menos de 8 caracteres
        !/[a-z]/.test(senha) || // Pelo menos uma letra minúscula
        !/[A-Z]/.test(senha) || // Pelo menos uma letra maiúscula
        !/\d/.test(senha) || // Pelo menos um número
        !/[@#$%^&+=!*-]/.test(senha) // Pelo menos um caracter especial
      ) {
        return res
          .status(400)
          .json("O campo senha está em um formato inválido.");
      }
      //criptografa a senha
      const hashedSenha = await bcrypt.hash(senha, 8);
      //Adiciona o endereço no BD
      const endereco = await Enderecos.create({
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
      const enderecoId = endereco.id; //Pega o Id criado do endereço
      const usuario = await Usuarios.create({
        enderecoId,
        nomeCompleto,
        cpf,
        dataNascimento,
        telefone,
        email,
        senha: hashedSenha,
        tipoUsuario: "Comprador",
      });

      //Criação de registro na tabela de associação
      const usuarios_enderecos = await UsuariosEnderecos.create({
        usuarioId: usuario.id,
        enderecoId: endereco.id,
      });

      return res
        .status(201)
        .send({ data: "Usuario salvo com sucesso!", usuario: usuario });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  // Método para adicionar um usuário ADMIN
  async adicionarUsuarioAdmin(req, res) {
    try {
      const {
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

      // Verificação de autenticação JWT
      const token = req.header("Authorization");
      if (!token) {
        return res.status(401).json({ error: "Autenticação JWT inexistente." });
      }

      // Verifica se os campos obrigatórios estão ausentes ou vazios
      const camposEmFalta = [];
      // Objeto com mensagens de erro personalizadas
      const mensagensErro = {
        cep: "O campo CEP é obrigatório.",
        logradouro: "O campo Logradouro é obrigatório.",
        numero: "O campo Número é obrigatório.",
        bairro: "O campo Bairro é obrigatório.",
        cidade: "O campo Cidade é obrigatório.",
        estado: "O campo Estado é obrigatório.",
        nomeCompleto: "O campo Nome Completo é obrigatório.",
        cpf: "O campo CPF é obrigatório.",
        dataNascimento: "O campo Data de Nascimento é obrigatório.",
        telefone: "O campo Telefone é obrigatório.",
        email: "O campo Email é obrigatório.",
        senha: "O campo Senha é obrigatório.",
      };

      // Verifica os campos obrigatórios
      for (const campo in mensagensErro) {
        if (!req.body[campo]) {
          camposEmFalta.push(mensagensErro[campo]);
        }
      }

      // Se houver campos em falta, retorne o status 422 com as mensagens de erro
      if (camposEmFalta.length > 0) {
        return res.status(422).json({ error: camposEmFalta.join("\n") });
      }

      // Verifica se o email já está cadastrado
      const emailExiste = await Usuarios.findOne({ where: { email: email } });
      if (emailExiste) {
        return res.status(409).json({ error: "Email já cadastrado." });
      }

      // Verifica se o cpf já está cadastrado
      const cpfExiste = await Usuarios.findOne({ where: { cpf: cpf } });
      if (cpfExiste) {
        return res.status(409).json({ error: "CPF já cadastrado." });
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        // Verifica o formato do email
        return res
          .status(400)
          .json("O campo email está em um formato inválido.");
      }
      // Verifica o formato do telefone
      if (!/^\d{8,10}$/.test(telefone)) {
        return res
          .status(400)
          .json("O campo telefone está em um formato inválido.");
      }

      // Verifica se há apenas números no telefone
      if (!/^[0-9]+$/.test(telefone)) {
        return res
          .status(400)
          .json("O campo telefone deve conter apenas números.");
      }

      // Verifica o formato do CPF
      if (!/^\d{11}$/.test(cpf)) {
        return res.status(400).json("O campo CPF está em um formato inválido.");
      }

      // Verifica se há apenas números no CPF
      if (!/^[0-9]+$/.test(cpf)) {
        return res.status(400).json("O campo CPF deve conter apenas números.");
      }

      if (
        senha.length < 8 ||
        !/[a-z]/.test(senha) || // Pelo menos uma letra minúscula
        !/[A-Z]/.test(senha) || // Pelo menos uma letra maiúscula
        !/\d/.test(senha) || // Pelo menos um número
        !/[@#$%^&+=!*-]/.test(senha) // Pelo menos um caracter especial
      ) {
        return res
          .status(400)
          .json("O campo senha está em um formato inválido.");
      }

      //Adiciona o endereço no BD
      const endereco = await Enderecos.create({
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

      //criptografa a senha
      const hashedSenha = await bcrypt.hash(senha, 10);

      const enderecoId = endereco.id; //Pega o Id criado do endereço

      const usuario = await Usuarios.create({
        enderecoId,
        nomeCompleto,
        cpf,
        dataNascimento,
        telefone,
        email,
        senha: hashedSenha,
        criadoPor,
        tipoUsuario: "Administrador",
      });

      //Criação de registro na tabela de associação
      const usuarios_enderecos = await UsuariosEnderecos.create({
        usuarioId: usuario.id,
        enderecoId: endereco.id,
      });

      return res
        .status(201)
        .send({ data: "Usuario salvo com sucesso!", usuario: usuario });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}

module.exports = new UsuarioController();
