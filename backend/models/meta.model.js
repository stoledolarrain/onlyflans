const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Meta = sequelize.define("Meta", {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  return Meta;
};