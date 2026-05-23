const jwt = require("jsonwebtoken");

// Clave secreta (debería venir del archivo .env)
const secret = process.env.JWT_SECRET || "secreto_de_desarrollo_por_defecto";

const generateToken = (payload) => {
  // El token durará 24 horas
  return jwt.sign(payload, secret, { expiresIn: "1d" });
};

const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
};