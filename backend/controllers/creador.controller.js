const creadorService = require("../services/creador.service");

// [CREADOR] Crear o actualizar su foto, banner y descripción
exports.putPerfil = async (req, res) => {
  try {
    const creadorId = req.user.id;
    const { descripcion, fotoUrl, bannerUrl } = req.body;

    const perfil = await creadorService.actualizarPerfil(
      creadorId,
      descripcion,
      fotoUrl,
      bannerUrl,
    );
    res.status(200).json({ message: "Perfil actualizado.", perfil });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar perfil.", error: error.message });
  }
};

// [CREADOR] Definir una meta
exports.postMeta = async (req, res) => {
  try {
    const creadorId = req.user.id;
    const { titulo, descripcion } = req.body;

    const meta = await creadorService.crearMeta(creadorId, titulo, descripcion);
    res.status(201).json({ message: "Meta creada.", meta });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la meta.", error: error.message });
  }
};

// [CREADOR] Reporte de ingresos (filtrado por fechas)
exports.getReporteIngresos = async (req, res) => {
  try {
    const creadorId = req.user.id;
    const { fechaInicio, fechaFin } = req.query; // Vienen en la URL: ?fechaInicio=2026-01-01&fechaFin=2026-12-31

    const reporte = await creadorService.obtenerReporteFlanes(
      creadorId,
      fechaInicio,
      fechaFin,
    );
    res.status(200).json(reporte);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al generar reporte.", error: error.message });
  }
};

// ---> NUEVA FUNCIÓN PARA EL DASHBOARD DEL CREADOR <---
exports.getMiPerfilCompleto = async (req, res) => {
  try {
    const creadorId = req.user.id;
    // Usamos el mismo servicio del perfil público para extraer tu foto, banner y metas
    const perfilCompleto = await creadorService.obtenerPerfilPublico(
      creadorId,
      creadorId,
    );
    res.status(200).json(perfilCompleto);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al cargar tu perfil.", error: error.message });
  }
};

// [SEGUIDOR] Ver listado alfabético de creadores
exports.getListaCreadores = async (req, res) => {
  try {
    const creadores = await creadorService.listarCreadoresAlfabeticamente();
    res.status(200).json(creadores);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al listar creadores.", error: error.message });
  }
};

// [SEGUIDOR] Ver el perfil de un creador específico
exports.getPerfilCreador = async (req, res) => {
  try {
    const { creadorId } = req.params;
    const seguidorId = req.user.id;

    // El servicio se encargará de verificar si este seguidor ya donó para mostrarle o no los posts
    const perfilCompleto = await creadorService.obtenerPerfilPublico(
      creadorId,
      seguidorId,
    );

    if (!perfilCompleto) {
      return res.status(404).json({ message: "Creador no encontrado." });
    }
    res.status(200).json(perfilCompleto);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al cargar el perfil.", error: error.message });
  }
};
