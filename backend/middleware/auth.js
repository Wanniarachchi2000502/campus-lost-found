const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('./error');
module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) throw new AppError('Not authorized, token missing', 401);
    let payload;
    try { payload = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET); }
    catch { throw new AppError('Invalid or expired token', 401); }
    const user = await User.findById(payload.id);
    if (!user) throw new AppError('User no longer exists', 401);
    req.user = user;
    next();
  } catch (err) { next(err); }
};
