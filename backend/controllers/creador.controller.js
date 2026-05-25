const creadorService = require("../services/creador.service");
const db = require("../models");

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

exports.getReporteIngresos = async (req, res) => {
  try {
    const creadorId = req.user.id;
    const { fechaInicio, fechaFin } = req.query;

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

exports.getMiPerfilCompleto = async (req, res) => {
  try {
    const creadorId = req.user.id;

    const usuarioModel = db.usuario || db.Usuario;
    const perfilModel = db.perfil || db.Perfil;
    const metaModel = db.meta || db.Meta || db.metas || db.Metas;

    const usuario = await usuarioModel.findByPk(creadorId, {
      attributes: ["id", "nombre", "email", "rol"],
    });
    const perfil = await perfilModel.findOne({ where: { creadorId } });
    const metas = await metaModel.findAll({ where: { creadorId } });

    res.status(200).json({
      creador: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        Perfil: perfil,
        Meta: metas,
      },
    });
  } catch (error) {
    console.error("Error en getMiPerfilCompleto:", error);
    res
      .status(500)
      .json({
        message: "Error al cargar perfil del creador.",
        error: error.message,
      });
  }
};

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

exports.getPerfilCreador = async (req, res) => {
  try {
    const { creadorId } = req.params;
    const seguidorId = req.user.id;

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
