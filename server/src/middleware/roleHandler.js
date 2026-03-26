export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Assuming req.user is set by your JWT middleware
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user?.role || 'Guest'} is not authorized to access this route`
      });
    }
    next();
  };
};
