import jwt from 'jsonwebtoken';

export const authMiddleware = (roles = []) => {
  // roles: ['admin', 'staff', 'customer'] hoặc [] cho tất cả
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ error: 'Permission denied' });
      }
      req.user = user;
      next();
    });
  };
};


// Middleware xác thực refresh token
export const refreshTokenMiddleware = (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid refresh token' });
    req.user = user;
    next();
  });
};
