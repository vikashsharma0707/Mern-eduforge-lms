const path = require('path');
const Document = require('../models/Document');
const { ingestFile, askWithContext } = require('../rag/vectorStore');

exports.upload = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const doc = await ingestFile({
    userId: req.user._id,
    courseId: req.body.courseId || null,
    filename: req.file.originalname,
    filePath: req.file.path,
    fileUrl: `/uploads/notes/${req.file.filename}`,
    mimeType: req.file.mimetype,
    title: req.body.title || req.file.originalname,
  });
  res.status(201).json({ _id: doc._id, title: doc.title, chunks: doc.chunks.length });
};

exports.list = async (req, res) =>
  res.json(await Document.find({ user: req.user._id }).select('title filename createdAt chunks').sort({ createdAt: -1 }));

exports.ask = async (req, res) => {
  const { docId, query } = req.body;
  if (!query) return res.status(400).json({ message: 'query required' });
  const result = await askWithContext({ userId: req.user._id, docId, query });
  res.json(result);
};

exports.remove = async (req, res) => {
  await Document.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ ok: true });
};
