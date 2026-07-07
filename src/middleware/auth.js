const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token nao fornecido' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Formato invalido. Use: Bearer <token>' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cantina_secret');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalido ou expirado' });
  }
};