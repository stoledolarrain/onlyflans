const isJsonRequestValid = (req, res, next) => {
  // Solo nos importan las peticiones que envían datos
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is empty", // El mismo error que atrapaste en el proyecto 2
      });
    }
  }
  next();
};

module.exports = { isJsonRequestValid };