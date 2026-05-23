const express = require("express");
const router = express.Router();
const interaccionController = require("../controllers/interaccion.controller");

// Middlewares
const requireAuth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware");
const schemaValidation = require("../middlewares/schemaValidation.middleware");
const { comentarioSchema, favoritoSchema } = require("../validators/interaccion.schema");

router.use(requireAuth);

// Exclusivo para SEGUIDORES
router.post(
  "/comentar",
  requireRole("seguidor"),
  isJsonRequestValid,
  schemaValidation(comentarioSchema),
  interaccionController.postComentar
);

router.post(
  "/favorito",
  requireRole("seguidor"),
  isJsonRequestValid,
  schemaValidation(favoritoSchema),
  interaccionController.postToggleFavorito
);

router.get("/favoritos", requireRole("seguidor"), interaccionController.getMisFavoritos);

module.exports = router;