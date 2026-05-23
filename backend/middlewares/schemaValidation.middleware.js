const schemaValidation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        message: "Error de validación en los datos enviados",
        errors: errorMessages,
      });
    }

    next();
  };
};

module.exports = schemaValidation;