const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { Usuarios } = require('../models/usuarios');
const { Enderecos } = require('../models/enderecos');
const { UsuariosEnderecos } = require('../models/usuariosEnderecos');
const {
  validarNome,
  validarEmail,
  validarCPF,
  validarTelefone,
  validarTipoUsuario,
} = require('../utils/validacoes');

class UsuarioController {
  async login(req, res) {
    const { email, senha } = req.body;
    try {
      if (!email || !senha) {
        return res
          .status(401)
          .json({ message: 'E-mail e senha devem ser preenchidos.' });
      }
      const usuario = await Usuarios.findOne({ where: { email: email } });
      if (!usuario) {
        return res.status(401).json({ message: 'E-mail não encontrado.' });
      }
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ message: 'Senha inválida.' });
      }
      const token = jwt.sign(
        {
          id: usuario.id,
          tipoUsuario: usuario.tipoUsuario,
          email: usuario.email,
          nomeCompleto: usuario.nomeCompleto,
        },
        process.env.SECRET_KEY_JWT,
        { expiresIn: '1d' }
      );
      return res.status(200).send({
        message: 'Usuario logado com sucesso!',
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

      const camposEmFalta = [];

      const mensagensErro = {
        cep: 'O campo CEP é obrigatório.',
        logradouro: 'O campo Logradouro é obrigatório.',
        numero: 'O campo Número é obrigatório.',
        bairro: 'O campo Bairro é obrigatório.',
        cidade: 'O campo Cidade é obrigatório.',
        estado: 'O campo Estado é obrigatório.',
        nomeCompleto: 'O campo Nome Completo é obrigatório.',
        cpf: 'O campo CPF é obrigatório.',
        dataNascimento: 'O campo Data de Nascimento é obrigatório.',
        telefone: 'O campo Telefone é obrigatório.',
        email: 'O campo Email é obrigatório.',
        senha: 'O campo Senha é obrigatório.',
      };

      for (const campo in mensagensErro) {
        if (!req.body[campo]) {
          camposEmFalta.push(mensagensErro[campo]);
        }
      }

      if (camposEmFalta.length > 0) {
        return res.status(422).json({ message: camposEmFalta.join('\n') });
      }
     
      const emailExiste = await Usuarios.findOne({ where: { email: email } });
      if (emailExiste) {
        return res.status(409).json({
          message: 'E-mail já cadastrado, tente contato com o suporte. ',
        });
      }

      const cpfExiste = await Usuarios.findOne({ where: { cpf: cpf } });
      if (cpfExiste) {
        return res.status(409).json({ message: 'CPF já cadastrado.' });
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json('O Email não é válido.');
      }

      if (!/^\d{10,11}$/.test(telefone)) {
        return res.status(400).json({
          message: 'O campo telefone deve incluir DDD e o número de telefone.',
        });
      }

      if (!/^[0-9]+$/.test(telefone)) {
        return res
          .status(400)
          .json({ message: 'O campo telefone deve conter apenas números.' });
      }

      if (!/^\d{11}$/.test(cpf)) {
        return res
          .status(400)
          .json({ message: 'O CPF deve conter 11 número.' });
      }

      if (!/^[0-9]+$/.test(cpf)) {
        return res
          .status(400)
          .json({ message: 'O campo CPF deve conter apenas números.' });
      }

      if (
        senha.length < 8 ||
        !/[a-z]/.test(senha) ||
        !/[A-Z]/.test(senha) ||
        !/\d/.test(senha) ||
        !/[@#$%^&+=!*-]/.test(senha)
      ) {
        return res
          .status(400)
          .json({ message: 'O campo senha está em um formato inválido.' });
      }

      let endereco = await Enderecos.findOne({
        where: { cep: cep, numero: numero },
      });
      if (!endereco) {
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

      const hashedSenha = await bcrypt.hash(senha, 8);

      const enderecoId = endereco.id;
      const usuario = await Usuarios.create({
        enderecoId,
        nomeCompleto,
        cpf,
        dataNascimento,
        telefone,
        email,
        senha: hashedSenha,
        tipoUsuario: 'Comprador',
      });

      await UsuariosEnderecos.create({
        usuarioId: usuario.id,
        enderecoId: endereco.id,
      });

      return res.status(201).send({
        message: 'Usuario cadastrado com sucesso!',
        usuario: usuario,
        endereco: endereco,
      });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

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

      const camposEmFalta = [];

      const mensagensErro = {
        cep: 'O campo CEP é obrigatório.',
        logradouro: 'O campo Logradouro é obrigatório.',
        numero: 'O campo Número é obrigatório.',
        bairro: 'O campo Bairro é obrigatório.',
        cidade: 'O campo Cidade é obrigatório.',
        estado: 'O campo Estado é obrigatório.',
        nomeCompleto: 'O campo Nome Completo é obrigatório.',
        cpf: 'O campo CPF é obrigatório.',
        dataNascimento: 'O campo Data de Nascimento é obrigatório.',
        telefone: 'O campo Telefone é obrigatório.',
        email: 'O campo Email é obrigatório.',
        senha: 'O campo Senha é obrigatório.',
      };

      for (const campo in mensagensErro) {
        if (!req.body[campo]) {
          camposEmFalta.push(mensagensErro[campo]);
        }
      }

      if (camposEmFalta.length > 0) {
        return res.status(422).json({ message: camposEmFalta.join('\n') });
      }

      const emailExiste = await Usuarios.findOne({ where: { email: email } });
      if (emailExiste) {
        return res.status(409).json({ message: 'Email já cadastrado.' });
      }

      const cpfExiste = await Usuarios.findOne({ where: { cpf: cpf } });
      if (cpfExiste) {
        return res.status(409).json({ message: 'CPF já cadastrado.' });
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: 'O Email não é válido.' });
      }

      if (!/^\d{10,11}$/.test(telefone)) {
        return res.status(400).json({
          message: 'O campo telefone deve incluir DDD e o número de telefone.',
        });
      }

      if (!/^[0-9]+$/.test(telefone)) {
        return res
          .status(400)
          .json({ message: 'O campo telefone deve conter apenas números.' });
      }

      if (!/^\d{11}$/.test(cpf)) {
        return res
          .status(400)
          .json({ message: 'O CPF deve conter 11 número.' });
      }

      if (!/^[0-9]+$/.test(cpf)) {
        return res
          .status(400)
          .json({ message: 'O campo CPF deve conter apenas números.' });
      }

      if (
        senha.length < 8 ||
        !/[a-z]/.test(senha) ||
        !/[A-Z]/.test(senha) ||
        !/\d/.test(senha) ||
        !/[@#$%^&+=!*-]/.test(senha)
      ) {
        return res.status(400).json({
          message:
            'A senha deve ter 8 digitos, incluindo números, letra maiúscula, letra minúscula e caracteres especiais.',
        });
      }

      let endereco = await Enderecos.findOne({
        where: { cep: cep, numero: numero },
      });
      if (!endereco) {
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

      if (tipoUsuario !== 'Administrador' && tipoUsuario !== 'Comprador') {
        return res
          .status(400)
          .json({ message: 'O tipo de usuário não é válido.' });
      }

      const hashedSenha = await bcrypt.hash(senha, 10);

      const enderecoId = endereco.id;
      const usuario = await Usuarios.create({
        enderecoId,
        nomeCompleto,
        cpf,
        dataNascimento,
        telefone,
        email,
        senha: hashedSenha,
        criadoPor,
        tipoUsuario: tipoUsuario,
      });

      await UsuariosEnderecos.create({
        usuarioId: usuario.id,
        enderecoId: endereco.id,
      });

      return res.status(201).send({
        message: 'Usuario salvo com sucesso!',
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
            .json({ message: 'Endereço já cadastrado para este usuário.' });
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

      const enderecosUsuario = await UsuariosEnderecos.create({
        usuarioId: usuario.id,
        enderecoId: novoEndereco.id,
      });

      return res.status(200).json(enderecosUsuario);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro interno do servidor', cause: error.message });
    }
  }

  async listarUsuarios(req, res) {
    try {
      const { offset, limite } = req.params;
      const { nomeCompleto, createdAt, ordem } = req.query;

      const opcoesConsulta = {
        limit: Math.min(20, parseInt(limite)),
        offset: parseInt(offset),
      };
      if (nomeCompleto) {
        opcoesConsulta.where = {
          nomeCompleto: { [Op.iLike]: `%${nomeCompleto}%` },
        };
      }
      if (createdAt) {
        if (!opcoesConsulta.where) opcoesConsulta.where = {};
        opcoesConsulta.where.createdAt = {
          [Op.between]: [`${createdAt} 00:00:00`, `${createdAt} 23:59:59`],
        };
      }
      if (ordem === 'desc') {
        opcoesConsulta.order = [['createdAt', 'DESC']];
      } else {
        opcoesConsulta.order = [['createdAt', 'ASC']];
      }

      const totalRegistros = await Usuarios.count({
        where: opcoesConsulta.where, 
      });

      const registros = await Usuarios.findAll(opcoesConsulta);
      if (!registros || registros.length === 0) {
        return res
          .status(204)
          .json({ message: 'Nenhum resultado encontrado.' });
      }
  
      res.status(200).json({ contar: totalRegistros, resultados: registros });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Erro interno no servidor.', cause: error.message });
    }
  }

  async listarUsuarioPorId(req, res) {
    try {
      const { usuario_id } = req.params;

      if (isNaN(usuario_id)) {
        return res.status(400).json({ message: 'ID de usuário inválido.' });
      }

      const usuario = await Usuarios.findByPk(usuario_id);

      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      return res.status(200).json(usuario);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro interno no servidor.', cause: error.message });
    }
  }

  async atualizarCompradorPorId(req, res) {
    try {
      const { usuario_id } = req.params;
      const { nomeCompleto, email, cpf, telefone, tipoUsuario } = req.body;

      if (!req.body) {
        return res.status(400).json({ message: 'Corpo da requisição vazio.' });
      }

      const usuario = await Usuarios.findByPk(usuario_id);

      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      const camposPermitidos = [
        'nomeCompleto',
        'email',
        'cpf',
        'telefone',
        'tipoUsuario',
      ];

      const camposDesconhecidos = Object.keys(req.body).filter(
        (campo) => !camposPermitidos.includes(campo)
      );
      if (camposDesconhecidos.length > 0) {
        return res.status(422).json({
          message: `Campo desconhecidos: ${camposDesconhecidos.join(', ')}`,
        });
      }

      if (nomeCompleto !== undefined) {
        try {
          validarNome(nomeCompleto);
        } catch (error) {
          return res
            .status(422)
            .json({ message: 'O campo Nome não pode ser vazio.' });
        }
        usuario.nomeCompleto = nomeCompleto;
      }

      if (cpf !== undefined) {
        try {
          !validarCPF(cpf);
        } catch (error) {
          return res.status(422).json({ message: 'CPF inválido.' });
        }
        usuario.cpf = cpf;
      }

      if (email !== undefined) {
        try {
          validarEmail(email);
        } catch (error) {
          return res.status(422).json({ message: 'E-mail inválido.' });
        }
        usuario.email = email;
      }

      if (telefone !== undefined) {
        try {
          validarTelefone(telefone);
          usuario.telefone = telefone;
        } catch (error) {
          return res.status(422).json({
            message: 'Informe um telefone válido.',
          });
        }
      }

      if (tipoUsuario !== undefined) {
        try {
          validarTipoUsuario(tipoUsuario);
        } catch (error) {
          return res.status(422).json({ message: 'Tipo de usuário inválido.' });
        }

        if (tipoUsuario === 'Administrador') {
          usuario.tipoUsuario = tipoUsuario;
        } else {
          return res.status(422).json({
            message:
              'Não é permitido alterar o tipo Administrador para Comprador.',
          });
        }
      }

      await usuario.save();
      return res.status(204).json(usuario);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro no servidor.', cause: error.message });
    }
  }

  async listarEnderecosComprador(req, res) {
    try {
      const usuarioId = req.payload.id;

      const enderecoIds = await UsuariosEnderecos.findAll({
        where: { usuarioId },
        attributes: ['enderecoId'],
      });

      if (enderecoIds.length === 0) {
        return res.status(204).json({});
      }

      const ids = enderecoIds.map((item) => item.enderecoId);

      const enderecos = await Enderecos.findAll({
        where: { id: ids },
      });

      return res.status(200).json(enderecos);
    } catch (error) {
      console.error(error.message);
      return res.status(400).json({
        message: 'Erro ao listar os endereços!',
        error: error.message,
      });
    }
  }

  async recuperarSenha(req, res) {
    try {
      const { email, novaSenha, confirmarSenha } = req.body;

      if (novaSenha !== confirmarSenha) {
        return res.status(400).json({
          message: 'A nova senha e a confirmação da senha não coincidem.',
        });
      }

      const usuario = await Usuarios.findOne({
        where: { email: email },
      });

      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      const novaSenhaCriptografada = await bcrypt.hash(novaSenha, 8);

      await Usuarios.update(
        { senha: novaSenhaCriptografada },
        {
          where: {
            email: email,
          },
        }
      );

      return res.status(200).json({ message: 'Senha atualizada com sucesso.' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UsuarioController();
