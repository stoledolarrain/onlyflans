const express = require("express");
const router = express.Router();
const donacionController = require("../controllers/donacion.controller");

const requireAuth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware");
const schemaValidation = require("../middlewares/schemaValidation.middleware");
const { donacionSchema } = require("../validators/donacion.schema");

router.use(requireAuth);

router.post(
  "/",
  requireRole("seguidor"),
  isJsonRequestValid,
  schemaValidation(donacionSchema),
  donacionController.postDonarFlanes
);

router.get("/historial", requireRole("seguidor"), donacionController.getHistorialSeguidor);

module.exports = router;