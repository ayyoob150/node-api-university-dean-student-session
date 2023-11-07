const jwt = require('jsonwebtoken');

const studentAuthorization = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. Token missing.' });
    }

    try {
      const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET);
      if (allowedRoles !== decodedToken.role) {
        return res.status(403).json({ message: 'Access denied. Insufficient role.' });
      }

      req.user = decodedToken;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
  };
};

module.exports = studentAuthorization;