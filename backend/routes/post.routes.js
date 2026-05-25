const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");

// Middlewares
const requireAuth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware");
const schemaValidation = require("../middlewares/schemaValidation.middleware");
const { crearPostSchema } = require("../validators/post.schema");

router.use(requireAuth);

// Exclusivo para CREADORES
router.post(
  "/",
  requireRole("creador"),
  isJsonRequestValid,
  schemaValidation(crearPostSchema),
  postController.postCrearPost
);

router.get("/mis-posts", requireRole("creador"), postController.getMisPosts);

router.get("/feed", requireRole("seguidor"), postController.getFeedSeguidor);

module.exports = router;