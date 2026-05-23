const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Post = sequelize.define("Post", {
    texto: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    imagenUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    validate: {
      tieneContenido() {
        if (!this.texto && !this.imagenUrl) {
          throw new Error('El post debe tener texto o una imagen.');
        }
      }
    }
  });
  return Post;
};