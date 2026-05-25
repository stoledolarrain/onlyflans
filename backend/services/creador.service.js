const db = require("../models");
const { Op } = require("sequelize");

const creadorService = {
  actualizarPerfil: async (creadorId, descripcion, fotoUrl, bannerUrl) => {
    const perfil = await db.perfil.findOne({ where: { creadorId } });
    if (perfil) {
      return await perfil.update({ descripcion, fotoUrl, bannerUrl });
    }
    return await db.perfil.create({ creadorId, descripcion, fotoUrl, bannerUrl });
  },

  crearMeta: async (creadorId, titulo, descripcion) => {
    return await db.meta.create({ creadorId, titulo, descripcion });
  },

  obtenerReporteFlanes: async (creadorId, fechaInicio, fechaFin) => {
    // Req 10: Filtrado por fechas usando Op.between de Sequelize
    const whereClause = { creadorId };
    
    if (fechaInicio && fechaFin) {
      whereClause.createdAt = {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin + "T23:59:59Z")]
      };
    }

    const donaciones = await db.donacion.findAll({
      where: whereClause,
      include: [{ model: db.usuario, as: "donante", attributes: ["nombre", "email"] }],
      order: [["createdAt", "DESC"]]
    });

    const totalFlanes = donaciones.reduce((sum, donacion) => sum + donacion.cantidadFlanes, 0);

    return { totalFlanes, historial: donaciones };
  },

  listarCreadoresAlfabeticamente: async () => {
    return await db.usuario.findAll({
      where: { rol: "creador" },
      attributes: ["id", "nombre"],
      order: [["nombre", "ASC"]],
      include: [{ model: db.perfil, attributes: ["fotoUrl", "descripcion"] }]
    });
  },

  obtenerPerfilPublico: async (creadorId, seguidorId) => {
    const creador = await db.usuario.findOne({
      where: { id: creadorId, rol: "creador" },
      attributes: ["id", "nombre"],
      include: [
        { model: db.perfil },
        { model: db.meta }
      ]
    });

    if (!creador) return null;

    const donacionesPrevias = await db.donacion.count({
      where: { creadorId, seguidorId }
    });

    let posts = [];
    let accesoDesbloqueado = false;

    if (donacionesPrevias > 0) {
      accesoDesbloqueado = true;
      posts = await db.post.findAll({
        where: { creadorId },
        order: [["createdAt", "DESC"]]
      });
    }

    return {
      creador,
      accesoDesbloqueado,
      mensaje: accesoDesbloqueado ? "Posts desbloqueados." : "Debes donar un flan para ver las publicaciones.",
      posts
    };
  }
};

module.exports = creadorService;