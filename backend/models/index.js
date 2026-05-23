const { sequelize } = require("../config/db.config");

// 1. Importar todos los modelos
const usuario = require("./usuario.model")(sequelize);
const perfil = require("./perfil.model")(sequelize);
const meta = require("./meta.model")(sequelize);
const post = require("./post.model")(sequelize);
const comentario = require("./comentario.model")(sequelize);
const donacion = require("./donacion.model")(sequelize);

// 2. Definir las relaciones

// Un creador tiene UN perfil
usuario.hasOne(perfil, { foreignKey: "creadorId" });
perfil.belongsTo(usuario, { foreignKey: "creadorId" });

// Un creador tiene MUCHAS metas
usuario.hasMany(meta, { foreignKey: "creadorId" });
meta.belongsTo(usuario, { foreignKey: "creadorId" });

// Un creador tiene MUCHOS posts
usuario.hasMany(post, { foreignKey: "creadorId" });
post.belongsTo(usuario, { foreignKey: "creadorId" });

// Un post tiene MUCHOS comentarios
post.hasMany(comentario, { foreignKey: "postId" });
comentario.belongsTo(post, { foreignKey: "postId" });

// Un seguidor hace MUCHOS comentarios
usuario.hasMany(comentario, { foreignKey: "seguidorId" });
comentario.belongsTo(usuario, { as: "autor", foreignKey: "seguidorId" });

// RELACIONES DE DONACIÓN (Flanes)
// Un seguidor hace MUCHAS donaciones
usuario.hasMany(donacion, { foreignKey: "seguidorId" });
donacion.belongsTo(usuario, { as: "donante", foreignKey: "seguidorId" });

// Un creador recibe MUCHAS donaciones
usuario.hasMany(donacion, { foreignKey: "creadorId" });
donacion.belongsTo(usuario, { as: "receptor", foreignKey: "creadorId" });

// RELACIÓN DE FAVORITOS (Muchos a Muchos entre Seguidores y Creadores)
usuario.belongsToMany(usuario, {
  through: "Favoritos",
  as: "creadoresFavoritos",
  foreignKey: "seguidorId",
  otherKey: "creadorId"
});

// 3. Exportar todo
module.exports = {
  usuario,
  perfil,
  meta,
  post,
  comentario,
  donacion,
  sequelize,
  Sequelize: sequelize.Sequelize,
};