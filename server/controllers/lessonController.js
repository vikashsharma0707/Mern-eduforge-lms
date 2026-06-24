const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

exports.listByCourse = async (req, res) => {
  const lessons = await Lesson.find({ course: req.params.courseId }).sort({ position: 1 });
  res.json(lessons);
};

exports.get = async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return res.status(404).json({ message: 'Not found' });
  res.json(lesson);
};

exports.create = async (req, res) => {
  const course = await Course.findById(req.body.course || req.params.courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (req.user.role !== 'admin' && String(course.teacher) !== String(req.user._id))
    return res.status(403).json({ message: 'Forbidden' });
  const data = { ...req.body, course: course._id };
  if (req.file) data.videoUrl = `/uploads/courses/${req.file.filename}`;
  const lesson = await Lesson.create(data);
  res.status(201).json(lesson);
};

exports.update = async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return res.status(404).json({ message: 'Not found' });
  Object.assign(lesson, req.body);
  if (req.file) lesson.videoUrl = `/uploads/courses/${req.file.filename}`;
  await lesson.save();
  res.json(lesson);
};

exports.remove = async (req, res) => {
  await Lesson.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
