const Category = require('../models/Category');
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

exports.list = async (_req, res) => res.json(await Category.find().sort({ name: 1 }));
exports.create = async (req, res) => {
  const data = { ...req.body, slug: slugify(req.body.name) };
  res.status(201).json(await Category.create(data));
};
exports.update = async (req, res) =>
  res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.remove = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
