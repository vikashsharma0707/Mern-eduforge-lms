const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema(
  {
    text: String,
    embedding: [Number],
    index: Number,
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    title: String,
    filename: String,
    fileUrl: String,
    mimeType: String,
    chunks: [chunkSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
