require("dotenv").config(); // Carga las variables de entorno (.env)
const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();
const port = 3000;

// Middlewares globales obligatorios
app.use(cors()); // Permite que React (puerto 5173 o 3000) hable con Node
app.use(express.json()); // Entiende los JSON que manda Axios
app.use(express.urlencoded({ extended: true }));

// Rutas (las crearemos después)
// require('./routes')(app);

// Sincronización con SQLite
db.sequelize.sync({
    // force: true // Descomentar solo si necesitas borrar y recrear las tablas desde cero
}).then(() => {
    console.log("Base de datos sincronizada correctamente.");
}).catch((err) => {
    console.error("Error al sincronizar la BD:", err);
});

app.listen(port, () => {
    console.log(`API de OnlyFlans escuchando en el puerto ${port}`);
});