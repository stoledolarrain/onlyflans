const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Donacion = sequelize.define("Donacion", {
    cantidadFlanes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1 // No se puede donar 0 o números negativos
      }
    },
  });
  return Donacion;
};