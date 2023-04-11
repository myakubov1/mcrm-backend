const jwt = require('jsonwebtoken');

class AuthMiddleware {
  verifyToken = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Отсутствует токен авторизации' });
    } else {
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          res.status(401).json({ message: 'Неверный токен авторизации' });
        } else {
          req.user = decoded;
          next();
        }
      });
    }
  };
}
module.exports = new AuthMiddleware();
