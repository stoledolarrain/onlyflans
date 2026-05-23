const authService = require("../services/auth.service");
const { generateToken } = require("../utils/jwt.utils");
const { sha1Encode } = require("../utils/text.utils");

exports.postRegister = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "El correo electrónico ya está registrado." });
    }

    const encodedPassword = sha1Encode(password);
    await authService.createUser(nombre, email, encodedPassword, rol);

    res.status(201).json({ message: "Usuario registrado exitosamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario.", error: error.message });
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await authService.findUserByEmail(email);
    if (!usuario) {
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    const encodedPassword = sha1Encode(password);
    if (encodedPassword !== usuario.password) {
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    // El token guarda el ID y el ROL (vital para separar permisos)
    const token = generateToken({ id: usuario.id, rol: usuario.rol });

    res.status(200).json({ token, rol: usuario.rol, nombre: usuario.nombre });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión.", error: error.message });
  }
};

exports.getLogout = (req, res) => {
  // En APIs REST con JWT, el logout real se hace en el Frontend borrando el token.
  // Pero dejamos este endpoint para cumplir el requerimiento.
  res.status(200).json({ message: "Sesión cerrada exitosamente." });
};