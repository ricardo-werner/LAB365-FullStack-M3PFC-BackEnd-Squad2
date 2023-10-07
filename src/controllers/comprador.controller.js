const { Op } = require('sequelize');
const { Usuarios } = require('../models/usuarios');

class CompradorController {
  async listarComprador(req, res) {
    try {
      const { offset, limite } = req.params;
      const { nomeCompleto, createdAt, ordem } = req.query;

      if (req.usuario.tipoUsuario !== 'Administrador') {
        return res
          .status(403)
          .json({ message: 'Acesso negado. Você não é administrador.' });
      }

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
}

module.exports = new CompradorController();
