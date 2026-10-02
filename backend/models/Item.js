const mongoose = require('mongoose');
const CATEGORIES = ['ID Card', 'Wallet', 'Books', 'Keys', 'USB Drive', 'Headphones', 'Calculator', 'Other'];
const itemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    category: { type: String, enum: CATEGORIES, required: true },
    type: { type: String, enum: ['lost', 'found'], required: true },
    location: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    image: { type: String, default: null },
    status: { type: String, enum: ['Open', 'Claimed', 'Returned'], default: 'Open' },
  },
  { timestamps: true }
);
itemSchema.statics.CATEGORIES = CATEGORIES;
module.exports = mongoose.model('Item', itemSchema);
