const db = require("../models");
const { Op } = require("sequelize");

const donacionService = {
  registrarDonacion: async (seguidorId, creadorId, cantidadFlanes) => {
    if (seguidorId === creadorId) {
      throw new Error("Regla de negocio: No puedes auto-donarte flanes.");
    }

    const creador = await db.usuario.findOne({ where: { id: creadorId, rol: "creador" } });
    if (!creador) {
      throw new Error("Regla de negocio: El destinatario no existe o no es un creador.");
    }

    return await db.donacion.create({ seguidorId, creadorId, cantidadFlanes });
  },

  obtenerHistorialSeguidor: async (seguidorId, fechaInicio, fechaFin, nombreCreador) => {
    const whereClause = { seguidorId };
    
    if (fechaInicio && fechaFin) {
      whereClause.createdAt = {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin + "T23:59:59Z")]
      };
    }

    const creadorWhere = {};
    if (nombreCreador) {
      creadorWhere.nombre = { [Op.like]: `%${nombreCreador}%` };
    }

    return await db.donacion.findAll({
      where: whereClause,
      include: [{
        model: db.usuario,
        as: "receptor",
        attributes: ["nombre"],
        where: nombreCreador ? creadorWhere : undefined
      }],
      order: [["createdAt", "DESC"]]
    });
  }
};

module.exports = donacionService;