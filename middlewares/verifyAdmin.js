const verifyAdmin = (req, res, next) => {
  const { userRole } = req;
  // find out if user is an admin
  if (userRole !== 'admin') {
    next(new Error('Not authorized', { cause: 403 }));
  }
  next();
};

export default verifyAdmin;
