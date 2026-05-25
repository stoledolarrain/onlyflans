const db = require("../models");

const authService = {
  findUserByEmail: async (email) => {
    return await db.usuario.findOne({ where: { email } });
  },

  findUserById: async (id) => {
    return await db.usuario.findByPk(id);
  },

  createUser: async (nombre, email, password, rol) => {
    const nuevoUsuario = await db.usuario.create({ nombre, email, password, rol });
    
    if (rol === "creador") {
      await db.perfil.create({ creadorId: nuevoUsuario.id });
    }
    
    return nuevoUsuario;
  }
};

module.exports = authService;