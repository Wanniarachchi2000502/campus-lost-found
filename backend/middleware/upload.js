const multer = require('multer');
const path = require('path');
const { AppError } = require('./error');
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname) || '.jpg'}`),
});
module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    /^image\/(jpe?g|png|webp)$/.test(file.mimetype) ? cb(null, true) : cb(new AppError('Only JPG, PNG or WEBP images are allowed', 400)),
});
