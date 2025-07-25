const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Bug title is required'],
  },
  description: {
    type: String,
    required: [true, 'Bug description is required'],
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open',
  },
  reportedBy: { type: String }, 
}, {
  timestamps: true,
});

module.exports = mongoose.model('Bug', bugSchema);
