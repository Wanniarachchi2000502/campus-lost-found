class AppError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
const notFound = (req, res, next) => next(new AppError(`Route not found: ${req.originalUrl}`, 404));
const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Server error';
  if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors).map((e) => e.message).join(', '); }
  if (err.name === 'CastError') { status = 400; message = 'Invalid ID'; }
  if (err.code === 11000) { status = 409; message = 'Duplicate entry'; }
  if (err.name === 'MulterError') { status = 400; message = err.message; }
  if (status === 500) console.error(err);
  res.status(status).json({ message });
};
module.exports = { AppError, notFound, errorHandler };
