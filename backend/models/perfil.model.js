const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Perfil = sequelize.define("Perfil", {
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fotoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bannerUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return Perfil;
};