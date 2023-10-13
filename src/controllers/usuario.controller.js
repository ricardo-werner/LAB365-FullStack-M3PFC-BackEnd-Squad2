const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op, Model, where } = require("sequelize");
const { Usuarios } = require("../models/usuarios");
const { Enderecos } = require("../models/enderecos");
const { UsuariosEnderecos } = require("../models/usuariosEnderecos");
const {
  validarNome,
  validarEmail,
  validarCPF,
  validarTelefone,
  validarTipoUsuario,
} = require("../utils/validacoes");

class UsuarioController {
  async login(req, res) {
    const { email, senha } = req.body;
    try {
      if (!email || !senha) {
        return res
          .status(401)
          .json({ message: "E-mail e senha devem ser preenchidos." });
      }
      const usuario = await Usuarios.findOne({ where: { email: email } });
      if (!usuario) {
        return res.status(401).json({ message: "E-mail não encontrado." });
      }
      const senhaValida = await bcrypt.compare(senha, usuario.senha); // Compara a senha informada com a senha criptografada no BD
      if (!senhaValida) {
        return res.status(401).json({ message: "Senha inválida." });
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
        .send({
          message: "Usuario logado com sucesso!",
          token: token,
          id: usuario.id,
          tipoUsuario: usuario.tipoUsuario,
          email: usuario.email,
          nomeCompleto: usuario.nomeCompleto,
        });
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
        return res.status(422).json({ message: camposEmFalta.join("\n") });
      }
      // Verifica se o email já está cadastrado
      const emailExiste = await Usuarios.findOne({ where: { email: email } });
      if (emailExiste) {
        return res.status(409).json({ message: "Email já cadastrado." });
      }

      // Verifica se o cpf já está cadastrado
      const cpfExiste = await Usuarios.findOne({ where: { cpf: cpf } });
      if (cpfExiste) {
        return res.status(409).json({ message: "CPF já cadastrado." });
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
          .json({ message: "O campo telefone está em um formato inválido." });
      }

      // Verifica se há apenas números no telefone
      if (!/^[0-9]+$/.test(telefone)) {
        return res
          .status(400)
          .json({ message: "O campo telefone deve conter apenas números." });
      }

      // Verifica o formato do CPF
      if (!/^\d{11}$/.test(cpf)) {
        return res
          .status(400)
          .json({ message: "O campo CPF está em um formato inválido." });
      }

      // Verifica se há apenas números no CPF
      if (!/^[0-9]+$/.test(cpf)) {
        return res
          .status(400)
          .json({ message: "O campo CPF deve conter apenas números." });
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
          .json({ message: "O campo senha está em um formato inválido." });
      }

      //verifica se já existe um cep com o numero cadastrado, se o cep existir, usa ele, se não,cria um endereço
      let endereco = await Enderecos.findOne({
        where: { cep: cep, numero: numero },
      });
      if (!endereco) {
        //Adiciona o endereço no BD
        endereco = await Enderecos.create({
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
      }

      //criptografa a senha
      const hashedSenha = await bcrypt.hash(senha, 8);

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

      await UsuariosEnderecos.create({
        usuarioId: usuario.id,
        enderecoId: endereco.id,
      });

      return res.status(201).send({
        message: "Usuario cadastrado com sucesso!",
        usuario: usuario,
        endereco: endereco,
      });
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
        return res.status(422).json({ message: camposEmFalta.join("\n") });
      }

      // Verifica se o email já está cadastrado
      const emailExiste = await Usuarios.findOne({ where: { email: email } });
      if (emailExiste) {
        return res.status(409).json({ message: "Email já cadastrado." });
      }

      // Verifica se o cpf já está cadastrado
      const cpfExiste = await Usuarios.findOne({ where: { cpf: cpf } });
      if (cpfExiste) {
        return res.status(409).json({ message: "CPF já cadastrado." });
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        // Verifica o formato do email
        return res
          .status(400)
          .json({ message: "O campo email está em um formato inválido." });
      }
      // Verifica o formato do telefone
      if (!/^\d{8,10}$/.test(telefone)) {
        return res
          .status(400)
          .json({ message: "O campo telefone está em um formato inválido." });
      }

      // Verifica se há apenas números no telefone
      if (!/^[0-9]+$/.test(telefone)) {
        return res
          .status(400)
          .json({ message: "O campo telefone deve conter apenas números." });
      }

      // Verifica o formato do CPF
      if (!/^\d{11}$/.test(cpf)) {
        return res
          .status(400)
          .json({ message: "O campo CPF está em um formato inválido." });
      }

      // Verifica se há apenas números no CPF
      if (!/^[0-9]+$/.test(cpf)) {
        return res
          .status(400)
          .json({ message: "O campo CPF deve conter apenas números." });
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
          .json({ message: "O campo senha está em um formato inválido." });
      }

      //verifica se já existe um cep com o numero cadastrado, se o cep existir, usa ele, se não,cria um endereço
      let endereco = await Enderecos.findOne({
        where: { cep: cep, numero: numero },
      });
      if (!endereco) {
        //Adiciona o endereço no BD
        endereco = await Enderecos.create({
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
      }

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
      await UsuariosEnderecos.create({
        usuarioId: usuario.id,
        enderecoId: endereco.id,
      });

      return res.status(201).send({
        message: "Usuario salvo com sucesso!",
        usuario: usuario,
        endereco: endereco,
      });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  async adicionarNovoEndereco(req, res) {
    try {
      const { usuario } = req;
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
      } = req.body;

      console.log(usuario, "usuarioId");

      const enderecoExistente = await Enderecos.findOne({
        where: { cep, numero },
      });
      if (enderecoExistente) {
        const associacaoExistente = await UsuariosEnderecos.findOne({
          where: {
            usuarioId: usuario.id,
            enderecoId: enderecoExistente.id,
          },
        });

        if (associacaoExistente) {
          return res
            .status(409)
            .json({ message: "Endereço já cadastrado para este usuário." });
        }
      }

      const novoEndereco = await Enderecos.create({
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



      const enderecosUsuario= await UsuariosEnderecos.create({
        usuarioId: usuario.id,
        enderecoId: novoEndereco.id,
      });

      return res.status(200).json(enderecosUsuario);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno do servidor", cause: error.message });
    }
  }

  async listarComprador(req, res) {
    try {
      const { offset, limite } = req.params;
      const { nomeCompleto, createdAt, ordem } = req.query;

      const opcoesConsulta = {
        where: {
          tipoUsuario: "Comprador",
        },
        limit: Math.min(20, parseInt(limite)),
        offset: parseInt(offset),
      };
      if (nomeCompleto) {
        opcoesConsulta.where.nomeCompleto = { [Op.iLike]: `%${nomeCompleto}%` };
      }
      if (createdAt) {
        opcoesConsulta.where.createdAt = {
          [Op.between]: [`${createdAt} 00:00:00`, `${createdAt} 23:59:59`],
        };
      }
      if (ordem === "desc") {
        opcoesConsulta.order = [["createdAt", "DESC"]];
      } else {
        opcoesConsulta.order = [["createdAt", "ASC"]];
      }
      const registros = await Usuarios.findAll(opcoesConsulta);
      if (!registros || registros.length === 0) {
        return res
          .status(204)
          .json({ message: "Nenhum resultado encontrado." });
      }
      res.status(200).json({ contar: registros.length, resultados: registros });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro interno no servidor.", cause: error.message });
    }
  }

  async listarUsuarioPorId(req, res) {
    try {
      const { usuario_id } = req.params;

      if (isNaN(usuario_id)) {
        return res.status(400).json({ message: "ID de usuário inválido." });
      }

      // Consultar o usuário por ID no banco de dados
      const usuario = await Usuarios.findByPk(usuario_id);

      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // Retorna os detalhes do usuário como um objeto JSON
      return res.status(200).json(usuario);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno no servidor.", cause: error.message });
    }
  }

  async atualizarCompradorPorId(req, res) {
    try {
      const { usuario_id } = req.params;
      const { nomeCompleto, email, cpf, telefone, tipoUsuario } = req.body;

      if (!req.body) {
        return res.status(400).json({ message: "Corpo da requisição vazio." });
      }

      const usuario = await Usuarios.findByPk(usuario_id);

      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const camposPermitidos = [
        "nomeCompleto",
        "email",
        "cpf",
        "telefone",
        "tipoUsuario",
      ];

      const camposDesconhecidos = Object.keys(req.body).filter(
        (campo) => !camposPermitidos.includes(campo)
      );
      if (camposDesconhecidos.length > 0) {
        return res.status(422).json({
          message: `Campo desconhecidos: ${camposDesconhecidos.join(", ")}`,
        });
      }

      //valida e atualiza os campos
      if (nomeCompleto !== undefined) {
        try {
          validarNome(nomeCompleto);
        } catch (error) {
          return res
            .status(422)
            .json({ message: "O campo Nome não pode ser vazio." });
        }
        usuario.nomeCompleto = nomeCompleto;
      }

      if (cpf !== undefined) {
        try {
          !validarCPF(cpf);
        } catch (error) {
          return res.status(422).json({ message: "CPF inválido." });
        }
        usuario.cpf = cpf;
      }

      if (email !== undefined) {
        try {
          validarEmail(email);
        } catch (error) {
          return res.status(422).json({ message: "E-mail inválido." });
        }
        usuario.email = email;
      }

      if (telefone !== undefined) {
        try {
          validarTelefone(telefone);
          usuario.telefone = telefone;
        } catch (error) {
          return res.status(422).json({
            message:
              "O campo telefone não pode ser negativo e não pode ter caracteres.",
          });
        }
      }

      //validar campo tipoUsuario
      if (tipoUsuario !== undefined) {
        try {
          validarTipoUsuario(tipoUsuario);
        } catch (error) {
          return res.status(422).json({ message: "Tipo de usuário inválido." });
        }

        //não deve permitir trocar 'Administrador' para 'Comprador'
        if (tipoUsuario === "Administrador") {
          usuario.tipoUsuario = tipoUsuario;
        } else {
          return res.status(422).json({
            message:
              "Não é permitido alterar o tipo Administrador para Comprador.",
          });
        }
      }
      //salva as alterações no banco
      await usuario.save();
      return res.status(204).json(usuario);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro no servidor.", cause: error.message });
    }
  }

  async listarEnderecosComprador(req, res) {
    try {
      const usuarioId = req.payload.id;
      // Consulta os endereços cadastrados do usuário com base no usuárioId
      const enderecoIds = await UsuariosEnderecos.findAll({
        where: { usuarioId },
        attributes: ["enderecoId"], // Obtém apenas os IDs dos endereços
      });

      if (enderecoIds.length === 0) {
        return res.status(204).send({});
      }

      // Mapeie os IDs de endereços
      const ids = enderecoIds.map((item) => item.enderecoId);

      // Consulte os detalhes dos endereços com base nos IDs mapeados
      const enderecos = await Enderecos.findAll({
        where: { id: ids }, // Consulta pelos IDs mapeados
      });

      return res.status(200).send(enderecos);
    } catch (error) {
      console.error(error.message);
      return res.status(400).send({
        message: "Erro ao listar os endereços!",
        error: error.message,
      });
    }
  }

  async recuperarSenha(req, res) {
    try {
      const { email, novaSenha, confirmarSenha } = req.body;

      if (novaSenha !== confirmarSenha) {
        return res.status(400).json({
          error: "A nova senha e a confirmação da senha não coincidem.",
        });
      }

      // Verifica se o email do usuário existe no banco de dados
      const usuario = await Usuarios.findOne({
        where: { email: email },
      });

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      // Gere uma nova senha criptografada
      const novaSenhaCriptografada = await bcrypt.hash(novaSenha, 8);

      // Atualize a senha do usuário no banco de dados
      await Usuarios.update(
        { senha: novaSenhaCriptografada },
        {
          where: {
            email: email,
          },
        }
      );

      return res.status(200).json({ message: "Senha atualizada com sucesso." });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UsuarioController();
