const Joi = require("joi");

const donacionSchema = Joi.object({
  creadorId: Joi.number().integer().required().messages({
    "number.base": "El ID del creador debe ser un número",
    "any.required": "Debes especificar a qué creador donar",
  }),
  cantidadFlanes: Joi.number().integer().min(1).required().messages({
    "number.min": "Debes donar al menos 1 flan",
    "any.required": "La cantidad de flanes es obligatoria",
  }),
});

module.exports = { donacionSchema };