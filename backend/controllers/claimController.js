const Item = require('../models/Item');
const Claim = require('../models/Claim');
const { AppError } = require('../middleware/error');

// Submit a claim for a found item
exports.create = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) throw new AppError('Item not found', 404);
    if (item.type !== 'found') throw new AppError('Only found items can be claimed');
    if (item.status === 'Returned') throw new AppError('This item has already been returned');
    if (item.userId.toString() === req.user.id) throw new AppError('You cannot claim your own report', 403);
    if (await Claim.exists({ itemId: item._id, userId: req.user.id })) throw new AppError('You have already claimed this item', 409);
    const claim = await Claim.create({ itemId: item._id, userId: req.user.id, description: req.body.description });
    res.status(201).json(claim);
  } catch (err) { next(err); }
};

exports.mine = async (req, res, next) => {
  try { res.json(await Claim.find({ userId: req.user.id }).populate('itemId', 'title image status type').sort('-createdAt')); }
  catch (err) { next(err); }
};

// Item reporter views claims on their item
exports.forItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) throw new AppError('Item not found', 404);
    if (item.userId.toString() !== req.user.id) throw new AppError('Only the reporter can view claims', 403);
    res.json(await Claim.find({ itemId: item._id }).populate('userId', 'name email').sort('-createdAt'));
  } catch (err) { next(err); }
};

const ownClaim = async (req) => {
  const claim = await Claim.findById(req.params.id);
  if (!claim) throw new AppError('Claim not found', 404);
  if (claim.userId.toString() !== req.user.id) throw new AppError('You can only modify your own claims', 403);
  return claim;
};

exports.update = async (req, res, next) => {
  try {
    const claim = await ownClaim(req);
    if (claim.status !== 'Pending') throw new AppError('Only pending claims can be edited');
    claim.description = req.body.description;
    await claim.save();
    res.json(claim);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const claim = await ownClaim(req);
    if (claim.status === 'Approved') throw new AppError('Approved claims cannot be deleted');
    await claim.deleteOne();
    res.json({ message: 'Claim deleted' });
  } catch (err) { next(err); }
};

// Reporter approves/rejects. Approving returns the item and rejects other pending claims.
exports.setStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) throw new AppError('Status must be Approved or Rejected');
    const claim = await Claim.findById(req.params.id);
    if (!claim) throw new AppError('Claim not found', 404);
    const item = await Item.findById(claim.itemId);
    if (!item) throw new AppError('Item not found', 404);
    if (item.userId.toString() !== req.user.id) throw new AppError('Only the reporter can manage claims', 403);
    if (claim.status !== 'Pending') throw new AppError(`This claim is already ${claim.status.toLowerCase()}`);

    if (status === 'Approved') {
      if (item.status === 'Returned' || (await Claim.exists({ itemId: item._id, status: 'Approved' })))
        throw new AppError('This item already has an approved claim');
      claim.status = 'Approved';
      await claim.save();
      item.status = 'Returned';
      await item.save();
      await Claim.updateMany({ itemId: item._id, _id: { $ne: claim._id }, status: 'Pending' }, { status: 'Rejected' });
    } else {
      claim.status = 'Rejected';
      await claim.save();
    }
    res.json(claim);
  } catch (err) { next(err); }
};
