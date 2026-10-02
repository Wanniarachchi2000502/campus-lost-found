const mongoose = require('mongoose');
const claimSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
    claimDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);
// A user can only have one claim per item
claimSchema.index({ itemId: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model('Claim', claimSchema);
