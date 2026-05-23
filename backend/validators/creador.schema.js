const Joi = require("joi");

const perfilSchema = Joi.object({
  descripcion: Joi.string().allow("", null),
  fotoUrl: Joi.string().uri().allow("", null).messages({
    "string.uri": "La foto debe ser una URL válida",
  }),
  bannerUrl: Joi.string().uri().allow("", null).messages({
    "string.uri": "El banner debe ser una URL válida",
  }),
});

const metaSchema = Joi.object({
  titulo: Joi.string().required().messages({
    "string.empty": "El título de la meta es obligatorio",
  }),
  descripcion: Joi.string().required().messages({
    "string.empty": "La descripción de la meta es obligatoria",
  }),
});

module.exports = { perfilSchema, metaSchema };