const donacionService = require("../services/donacion.service");

// [SEGUIDOR] Comprar flanes (Donar a un creador)
exports.postDonarFlanes = async (req, res) => {
  try {
    const seguidorId = req.user.id;
    const { creadorId, cantidadFlanes } = req.body;

    if (cantidadFlanes <= 0) {
      return res.status(400).json({ message: "Debes donar al menos 1 flan." });
    }

    const donacion = await donacionService.registrarDonacion(seguidorId, creadorId, cantidadFlanes);
    res.status(201).json({ message: `¡Has donado ${cantidadFlanes} flanes exitosamente!`, donacion });
  } catch (error) {
    // Atrapamos reglas de negocio (ej. no donarse a sí mismo)
    if (error.message.startsWith("Regla de negocio")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Error al procesar la donación.", error: error.message });
  }
};

// [SEGUIDOR] Historial de donaciones que ha hecho (Filtros: fecha y nombre creador)
exports.getHistorialSeguidor = async (req, res) => {
  try {
    const seguidorId = req.user.id;
    const { fechaInicio, fechaFin, nombreCreador } = req.query;

    const historial = await donacionService.obtenerHistorialSeguidor(seguidorId, fechaInicio, fechaFin, nombreCreador);
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ message: "Error al cargar el historial.", error: error.message });
  }
};