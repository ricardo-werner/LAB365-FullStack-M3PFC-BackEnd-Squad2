const { Op } = require('sequelize');
const { Usuarios } = require('../models/usuarios');
const {
  validarNome,
  validarEmail,
  validarCPF,
  validarTelefone,
  validarTipoUsuario,
} = require('../utils/validacoes');

class CompradorController {
  async listarComprador(req, res) {
    try {
      const { offset, limite } = req.params;
      const { nomeCompleto, createdAt, ordem } = req.query;

      const opcoesConsulta = {
        where: {
          tipoUsuario: 'Comprador',
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

      if (ordem === 'desc') {
        opcoesConsulta.order = [['createdAt', 'DESC']];
      } else {
        opcoesConsulta.order = [['createdAt', 'ASC']];
      }

      const registros = await Usuarios.findAll(opcoesConsulta);

      if (!registros || registros.length === 0) {
        return res
          .status(204)
          .json({ message: 'Nenhum resultado encontrado.' });
      }

      res.status(200).json({ contar: registros.length, resultados: registros });
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

      console.log(usuario_id, 'usuario_id');

      // Consultar o usuário por ID no banco de dados
      const usuario = await Usuarios.findByPk(usuario_id);

      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      // Retorna os detalhes do usuário como um objeto JSON
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

      //valida e atualiza os campos
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
          validarTelefone(telefone)
          usuario.telefone = telefone;
        } catch (error) {
          return res.status(422).json({
            message:
              'O campo telefone não pode ser negativo e não pode ter caracteres.',
          });
        }
      }

      //validar campo tipoUsuario
      if (tipoUsuario !== undefined) {
        try {
          validarTipoUsuario(tipoUsuario);
        } catch (error) {
          return res.status(422).json({ message: 'Tipo de usuário inválido.' });
        }

        //não deve permitir trocar 'Administrador' para 'Comprador'
        if (tipoUsuario === 'Administrador') {
          usuario.tipoUsuario = tipoUsuario;
        } else {
          return res.status(422).json({
            message:
              'Não é permitido alterar o tipo Administrador para Comprador.',
          });
        }
      }
      //salva as alterações no banco
      await usuario.save();
      return res.status(204).json(usuario);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro no servidor.', cause: error.message });
    }
  }
}

module.exports = new CompradorController();
