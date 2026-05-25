const interaccionService = require("../services/interaccion.service");

exports.postComentar = async (req, res) => {
  try {
    const seguidorId = req.user.id;
    const { postId, texto } = req.body;

    const comentario = await interaccionService.crearComentario(seguidorId, postId, texto);
    res.status(201).json({ message: "Comentario guardado. Solo el creador lo verá.", comentario });
  } catch (error) {
    if (error.message.startsWith("Regla de negocio")) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Error al comentar.", error: error.message });
  }
};

exports.postToggleFavorito = async (req, res) => {
  try {
    const seguidorId = req.user.id;
    const { creadorId } = req.body;

    const resultado = await interaccionService.toggleFavorito(seguidorId, creadorId);
    res.status(200).json({ message: resultado.message });
  } catch (error) {
    res.status(500).json({ message: "Error al modificar favoritos.", error: error.message });
  }
};

exports.getMisFavoritos = async (req, res) => {
  try {
    const seguidorId = req.user.id;
    const favoritos = await interaccionService.obtenerFavoritos(seguidorId);
    res.status(200).json(favoritos);
  } catch (error) {
    res.status(500).json({ message: "Error al cargar favoritos.", error: error.message });
  }
};