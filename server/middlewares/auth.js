import jwt from 'jsonwebtoken';
import db from '../database/main';

/**
 *
 * Verify Token
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object|void} response object
 */
async function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(400).send({
      status: 400,
      error: 'Token is absent or invalid',
    });
  }
  try {
    const decoded = await jwt.verify(token, process.env.SECRET);
    const text = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await db.query(text, [decoded.userId]);
    if (!rows[0]) {
      return res.status(400).send({
        status: 400,
        error: 'Invalid token provided',
      });
    }
    req.user = { id: decoded.userId };
    req.username = (rows[0].username);
    next();
  } catch (error) {
    if (error.message === 'invalid signature') {
      return res.status(400).send({
        status: 400,
        error: 'Please use a correct token string',
      });
    }
    return res.status(400).send(error);
  }
}

export default verifyToken;
