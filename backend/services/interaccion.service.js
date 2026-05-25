const db = require("../models");

const interaccionService = {
  crearComentario: async (seguidorId, postId, texto) => {
    const post = await db.post.findByPk(postId);
    if (!post) throw new Error("Post no encontrado.");

    const donaciones = await db.donacion.count({
      where: { creadorId: post.creadorId, seguidorId }
    });

    if (donaciones === 0) {
      throw new Error("Regla de negocio: Debes donar al menos un flan al creador para poder comentar sus posts.");
    }

    return await db.comentario.create({ seguidorId, postId, texto });
  },

  toggleFavorito: async (seguidorId, creadorId) => {
    const seguidor = await db.usuario.findByPk(seguidorId);
    
    const yaEsFavorito = await seguidor.hasCreadoresFavorito(creadorId);

    if (yaEsFavorito) {
      await seguidor.removeCreadoresFavorito(creadorId);
      return { message: "Creador eliminado de favoritos." };
    } else {
      await seguidor.addCreadoresFavorito(creadorId);
      return { message: "Creador agregado a favoritos." };
    }
  },

  obtenerFavoritos: async (seguidorId) => {
    const seguidor = await db.usuario.findByPk(seguidorId, {
      include: [{
        model: db.usuario,
        as: "creadoresFavoritos",
        attributes: ["id", "nombre"],
        include: [{ model: db.perfil, attributes: ["fotoUrl"] }]
      }]
    });
    
    return seguidor ? seguidor.creadoresFavoritos : [];
  }
};

module.exports = interaccionService;