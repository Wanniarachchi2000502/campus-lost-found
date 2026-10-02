const r = require('express').Router();
const c = require('../controllers/claimController');
const protect = require('../middleware/auth');
r.use(protect);
r.get('/mine', c.mine);
r.route('/:id').put(c.update).delete(c.remove);
r.patch('/:id/status', c.setStatus);
module.exports = r;
