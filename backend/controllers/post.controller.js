const postService = require("../services/post.service");

// [CREADOR] Publicar un post
exports.postCrearPost = async (req, res) => {
  try {
    const creadorId = req.user.id;
    const { texto, imagenUrl } = req.body;

    if (!texto && !imagenUrl) {
      return res.status(400).json({ message: "El post debe tener al menos texto o una imagen." });
    }

    const nuevoPost = await postService.crearPost(creadorId, texto, imagenUrl);
    res.status(201).json({ message: "Post publicado.", post: nuevoPost });
  } catch (error) {
    res.status(500).json({ message: "Error al publicar post.", error: error.message });
  }
};

// [CREADOR] Ver sus propios posts y los comentarios que le dejaron (Req. 9 y 14)
exports.getMisPosts = async (req, res) => {
  try {
    const creadorId = req.user.id;
    const posts = await postService.obtenerPostsDeCreador(creadorId, true); // true = incluir comentarios
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al cargar tus publicaciones.", error: error.message });
  }
};

// [SEGUIDOR] Ver Feed de creadores favoritos/seguidos (Req. 16)
exports.getFeedSeguidor = async (req, res) => {
  try {
    const seguidorId = req.user.id;
    const feed = await postService.obtenerFeedParaSeguidor(seguidorId);
    res.status(200).json(feed);
  } catch (error) {
    res.status(500).json({ message: "Error al cargar el feed.", error: error.message });
  }
};