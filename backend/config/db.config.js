const { Sequelize } = require("sequelize");

// Configuración de SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: false // Mantiene tu consola limpia de sentencias SQL
});

// Prueba de conexión automática (tu excelente aporte del práctico 2)
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión a SQLite establecida correctamente para OnlyFlans.");
  })
  .catch((error) => {
    console.error("No se pudo conectar a la base de datos:", error);
  });

module.exports = {
  sequelize,
  Sequelize,
};