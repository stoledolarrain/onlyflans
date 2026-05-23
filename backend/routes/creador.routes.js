const express = require("express");
const router = express.Router();
const creadorController = require("../controllers/creador.controller");

// Middlewares
const requireAuth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware");
const schemaValidation = require("../middlewares/schemaValidation.middleware");
const { perfilSchema, metaSchema } = require("../validators/creador.schema");

router.use(requireAuth); // Todo requiere estar logueado

// Exclusivo para CREADORES
router.put(
  "/perfil",
  requireRole("creador"),
  isJsonRequestValid,
  schemaValidation(perfilSchema),
  creadorController.putPerfil
);

router.post(
  "/metas",
  requireRole("creador"),
  isJsonRequestValid,
  schemaValidation(metaSchema),
  creadorController.postMeta
);

router.get("/reporte", requireRole("creador"), creadorController.getReporteIngresos);

// Exclusivo para SEGUIDORES
router.get("/lista", requireRole("seguidor"), creadorController.getListaCreadores);
router.get("/:creadorId", requireRole("seguidor"), creadorController.getPerfilCreador);

module.exports = router;