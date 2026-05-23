const requireRole = (rolPermitido) => {
  return (req, res, next) => {
    // req.user ya fue cargado por auth.middleware
    if (req.user && req.user.rol === rolPermitido) {
      next();
    } else {
      res.status(403).json({ message: `Acceso denegado. Esta ruta es exclusiva para ${rolPermitido}es.` });
    }
  };
};

module.exports = requireRole;