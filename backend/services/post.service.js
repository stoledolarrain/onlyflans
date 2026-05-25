const db = require("../models");

const postService = {
  crearPost: async (creadorId, texto, imagenUrl) => {
    return await db.post.create({ creadorId, texto, imagenUrl });
  },

  obtenerPostsDeCreador: async (creadorId, incluirComentarios = false) => {
    // Req 9: El creador ve sus posts con los comentarios que le dejaron
    const opciones = {
      where: { creadorId },
      order: [["createdAt", "DESC"]],
    };

    if (incluirComentarios) {
      opciones.include = [
        {
          model: db.comentario,
          include: [{ model: db.usuario, as: "autor", attributes: ["nombre"] }],
        },
      ];
    }

    return await db.post.findAll(opciones);
  },

  obtenerFeedParaSeguidor: async (seguidorId) => {
    // Req 16: Obtener posts de los creadores marcados como favoritos
    const usuario = await db.usuario.findByPk(seguidorId, {
      include: [
        { model: db.usuario, as: "creadoresFavoritos", attributes: ["id"] },
      ],
    });

    if (!usuario || !usuario.creadoresFavoritos.length) {
      return [];
    }

    // Extraemos solo los IDs de los creadores favoritos
    const creadoresIds = usuario.creadoresFavoritos.map((c) => c.id);

    // Traemos los posts de esos creadores, ¡AHORA INCLUYENDO SUS COMENTARIOS!
    return await db.post.findAll({
      where: { creadorId: creadoresIds },
      include: [
        { model: db.usuario, attributes: ["nombre"] },
        {
          model: db.comentario,
          include: [{ model: db.usuario, as: "autor", attributes: ["nombre"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  },
};

module.exports = postService;
