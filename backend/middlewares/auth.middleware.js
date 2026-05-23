const { verifyToken } = require("../utils/jwt.utils");
const authService = require("../services/auth.service");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No autorizado. Token faltante." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await authService.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado." });
    }

    req.user = user; // Guardamos el usuario en la petición
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado." });
  }
};