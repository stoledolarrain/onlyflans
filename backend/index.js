require("dotenv").config(); // Carga las variables de entorno (.env)
const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();
// Usa el puerto del .env, o el 3000 por defecto
const port = process.env.PORT || 3000;

// Middlewares globales obligatorios
app.use(cors()); // Permite que React (puerto 5173 o 3000) hable con Node
app.use(express.json()); // Entiende los JSON que manda Axios o Postman
app.use(express.urlencoded({ extended: true }));

// --- CONEXIÓN DE RUTAS ---
// Esto le dice a Express que vaya al archivo routes/index.js y cargue todos los endpoints
require('./routes')(app);

// Sincronización con SQLite
db.sequelize.sync({
    // force: true // Descomentar solo si necesitas borrar y recrear las tablas desde cero
}).then(() => {
    console.log("Base de datos sincronizada correctamente.");
}).catch((err) => {
    console.error("Error al sincronizar la BD:", err);
});

// Levantar el servidor
app.listen(port, () => {
    console.log(`API de OnlyFlans escuchando en el puerto ${port}`);
});