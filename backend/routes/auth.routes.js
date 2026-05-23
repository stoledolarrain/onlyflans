const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Middlewares
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware");
const schemaValidation = require("../middlewares/schemaValidation.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.schema");

// Rutas
router.post("/register", isJsonRequestValid, schemaValidation(registerSchema), authController.postRegister);
router.post("/login", isJsonRequestValid, schemaValidation(loginSchema), authController.postLogin);
router.get("/logout", authController.getLogout);

module.exports = router;