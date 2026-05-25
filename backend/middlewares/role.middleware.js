const requireRole = (rolPermitido) => {
  return (req, res, next) => {
    if (req.user && req.user.rol === rolPermitido) {
      next();
    } else {
      res.status(403).json({ message: `Acceso denegado. Esta ruta es exclusiva para ${rolPermitido}es.` });
    }
  };
};

module.exports = requireRole;