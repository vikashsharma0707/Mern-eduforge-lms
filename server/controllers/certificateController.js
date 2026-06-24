const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

exports.issue = async (req, res) => {
  const { courseId } = req.params;
  const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
  if (!enrollment) return res.status(404).json({ message: 'Not enrolled' });
  if (enrollment.progress < 100) return res.status(400).json({ message: 'Complete the course first' });
  let cert = await Certificate.findOne({ student: req.user._id, course: courseId });
  if (cert) return res.json(cert);
  const serial = `EDU-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  cert = await Certificate.create({ student: req.user._id, course: courseId, serial });
  res.status(201).json(cert);
};

exports.my = async (req, res) => {
  const certs = await Certificate.find({ student: req.user._id }).populate('course', 'title slug thumbnail');
  res.json(certs);
};

exports.verify = async (req, res) => {
  const cert = await Certificate.findOne({ serial: req.params.serial })
    .populate('student', 'name email')
    .populate('course', 'title');
  if (!cert) return res.status(404).json({ message: 'Invalid certificate' });
  res.json(cert);
};
