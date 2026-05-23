const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Usuario = sequelize.define("Usuario", {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["creador", "seguidor"]],
      },
    },
  });
  return Usuario;
};