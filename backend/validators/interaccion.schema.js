const Joi = require("joi");

const comentarioSchema = Joi.object({
  postId: Joi.number().integer().required().messages({
    "any.required": "El ID del post es obligatorio",
  }),
  texto: Joi.string().required().messages({
    "string.empty": "El comentario no puede estar vacío",
  }),
});

const favoritoSchema = Joi.object({
  creadorId: Joi.number().integer().required().messages({
    "any.required": "El ID del creador es obligatorio",
  }),
});

module.exports = { comentarioSchema, favoritoSchema };