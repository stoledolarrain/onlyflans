const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Comentario = sequelize.define("Comentario", {
    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  return Comentario;
};