const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../middleware/error');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });
const emailOk = (e) => /^\S+@\S+\.\S+$/.test(e || '');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || name.trim().length < 2) throw new AppError('Name must be at least 2 characters');
    if (!emailOk(email)) throw new AppError('Enter a valid email address');
    if (!password || password.length < 6) throw new AppError('Password must be at least 6 characters');
    if (await User.findOne({ email: email.toLowerCase() })) throw new AppError('Email is already registered', 409);
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: sign(user._id), user: publicUser(user) });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!emailOk(email) || !password) throw new AppError('Email and password are required');
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) throw new AppError('Incorrect email or password', 401);
    res.json({ token: sign(user._id), user: publicUser(user) });
  } catch (err) { next(err); }
};

exports.me = (req, res) => res.json({ user: publicUser(req.user) });
