const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    req.user = decodedToken;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Некорректный токен' });
  }
};
