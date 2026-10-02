const fs = require('fs');
const path = require('path');
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const { AppError } = require('../middleware/error');

const removeImage = (img) => {
  if (img) fs.unlink(path.join(__dirname, '..', img), () => {});
};
const escapeRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getOwnedItem = async (req) => {
  const item = await Item.findById(req.params.id);
  if (!item) throw new AppError('Item not found', 404);
  if (item.userId.toString() !== req.user.id) throw new AppError('You can only modify your own reports', 403);
  return item;
};

exports.create = async (req, res, next) => {
  try {
    const { title, description, category, type, location, date } = req.body;
    const item = await Item.create({
      userId: req.user.id, title, description, category, type, location,
      date: date || undefined,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });
    res.status(201).json(item);
  } catch (err) { removeImage(req.file && `/uploads/${req.file.filename}`); next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const { search, type, category, status } = req.query;
    const q = {};
    if (type) q.type = type;
    if (category) q.category = category;
    if (status !== 'All') q.status = status || 'Open';
    if (search) {
      const rx = new RegExp(escapeRx(search.trim()), 'i');
      q.$or = [{ title: rx }, { description: rx }, { location: rx }];
    }
    res.json(await Item.find(q).populate('userId', 'name').sort('-createdAt'));
  } catch (err) { next(err); }
};

exports.mine = async (req, res, next) => {
  try { res.json(await Item.find({ userId: req.user.id }).sort('-createdAt')); }
  catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('userId', 'name email');
    if (!item) throw new AppError('Item not found', 404);
    const myClaim = await Claim.findOne({ itemId: item._id, userId: req.user.id });
    res.json({ ...item.toObject(), myClaim });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await getOwnedItem(req);
    ['title', 'description', 'category', 'type', 'location', 'date', 'status'].forEach((f) => {
      if (req.body[f] !== undefined && req.body[f] !== '') item[f] = req.body[f];
    });
    if (item.type === 'lost' && (await Claim.exists({ itemId: item._id })))
      throw new AppError('This item already has claims, so it cannot be changed to lost');
    if (req.file) { removeImage(item.image); item.image = `/uploads/${req.file.filename}`; }
    await item.save();
    res.json(item);
  } catch (err) { removeImage(req.file && `/uploads/${req.file.filename}`); next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await getOwnedItem(req);
    await Claim.deleteMany({ itemId: item._id });
    removeImage(item.image);
    await item.deleteOne();
    res.json({ message: 'Report deleted' });
  } catch (err) { next(err); }
};

exports.categories = (req, res) => res.json(Item.CATEGORIES);
