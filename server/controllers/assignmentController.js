const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const { evaluator } = require('../agents');

exports.listByCourse = async (req, res) =>
  res.json(await Assignment.find({ course: req.params.courseId }).sort({ dueDate: 1 }));

exports.create = async (req, res) => {
  const data = { ...req.body, createdBy: req.user._id };
  if (req.file) data.attachments = [{ name: req.file.originalname, url: `/uploads/assignments/${req.file.filename}` }];
  res.status(201).json(await Assignment.create(data));
};

exports.update = async (req, res) =>
  res.json(await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true }));

exports.remove = async (req, res) => {
  await Assignment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

exports.submit = async (req, res) => {
  const data = {
    assignment: req.params.id,
    student: req.user._id,
    text: req.body.text || '',
  };
  if (req.file) data.fileUrl = `/uploads/submissions/${req.file.filename}`;
  const sub = await Submission.create(data);
  res.status(201).json(sub);
};

exports.listSubmissions = async (req, res) => {
  const filter = req.user.role === 'student'
    ? { assignment: req.params.id, student: req.user._id }
    : { assignment: req.params.id };
  res.json(await Submission.find(filter).populate('student', 'name email'));
};

exports.grade = async (req, res) => {
  const sub = await Submission.findById(req.params.subId);
  if (!sub) return res.status(404).json({ message: 'Not found' });
  sub.marks = req.body.marks;
  sub.feedback = req.body.feedback;
  sub.status = 'graded';
  await sub.save();
  res.json(sub);
};

exports.aiGrade = async (req, res) => {
  const sub = await Submission.findById(req.params.subId);
  if (!sub) return res.status(404).json({ message: 'Not found' });
  const assignment = await Assignment.findById(sub.assignment);
  const result = await evaluator(
    `${assignment.title}\n${assignment.description}\n${assignment.instructions || ''}`,
    sub.text || '(file submission)'
  );
  sub.aiEvaluation = result;
  sub.marks = result.score;
  sub.status = 'graded';
  await sub.save();
  res.json(sub);
};
