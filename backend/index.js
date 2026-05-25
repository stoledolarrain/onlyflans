require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./routes")(app);

db.sequelize
  .sync({})
  .then(() => {
    console.log("Base de datos sincronizada correctamente.");
  })
  .catch((err) => {
    console.error("Error al sincronizar la BD:", err);
  });

app.listen(port, () => {
  console.log(`API de OnlyFlans escuchando en el puerto ${port}`);
});
