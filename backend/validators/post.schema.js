const Joi = require("joi");

const crearPostSchema = Joi.object({
  texto: Joi.string().allow("", null),
  imagenUrl: Joi.string().uri().allow("", null).messages({
    "string.uri": "La imagen debe ser una URL válida",
  }),
}).custom((obj, helpers) => {
  // Asegurarnos de que envíe al menos texto o una imagen
  if (!obj.texto && !obj.imagenUrl) {
    return helpers.error("any.invalid");
  }
  return obj;
}).messages({
  "any.invalid": "El post debe contener texto o una imagen como mínimo",
});

module.exports = { crearPostSchema };