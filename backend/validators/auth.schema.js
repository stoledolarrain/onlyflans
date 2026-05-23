const Joi = require("joi");

const registerSchema = Joi.object({
  nombre: Joi.string().min(3).required().messages({
    "string.empty": "El nombre no puede estar vacío",
    "any.required": "El nombre es obligatorio",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Debe ser un correo electrónico válido",
    "any.required": "El correo es obligatorio",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "any.required": "La contraseña es obligatoria",
  }),
  rol: Joi.string().valid("creador", "seguidor").required().messages({
    "any.only": "El rol solo puede ser 'creador' o 'seguidor'",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };