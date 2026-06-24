const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    serial: { type: String, required: true, unique: true },
    issuedAt: { type: Date, default: Date.now },
    url: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);
