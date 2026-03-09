export const authorize = (...roles) => {
  return (req, res, next) => {
    // Note: req.user comes from your JWT protect middleware (we'll add that next)
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized for this role' });
    }
    next();
  };
};
