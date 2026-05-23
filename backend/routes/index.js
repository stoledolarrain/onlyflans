const authRoutes = require("./auth.routes");
const creadorRoutes = require("./creador.routes");
const postRoutes = require("./post.routes");
const donacionRoutes = require("./donacion.routes");
const interaccionRoutes = require("./interaccion.routes");

module.exports = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/creadores", creadorRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/donaciones", donacionRoutes);
  app.use("/api/interacciones", interaccionRoutes);
};