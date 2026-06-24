const Notification = require('../models/Notification');

exports.list = async (req, res) =>
  res.json(await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100));

exports.markRead = async (req, res) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { read: true });
  res.json({ ok: true });
};

exports.markAllRead = async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ ok: true });
};

exports.create = async (req, res) => {
  const { user, title, message, type, link } = req.body;
  res.status(201).json(await Notification.create({ user, title, message, type, link }));
};
