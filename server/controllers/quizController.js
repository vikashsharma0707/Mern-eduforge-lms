const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

exports.listByCourse = async (req, res) =>
  res.json(await Quiz.find({ course: req.params.courseId, isPublished: true }));

exports.get = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ message: 'Not found' });
  // hide answers for students
  if (req.user.role === 'student') {
    const safe = quiz.toObject();
    safe.questions = safe.questions.map((q) => ({ _id: q._id, text: q.text, type: q.type, options: q.options, marks: q.marks }));
    return res.json(safe);
  }
  res.json(quiz);
};

exports.create = async (req, res) =>
  res.status(201).json(await Quiz.create({ ...req.body, createdBy: req.user._id }));

exports.update = async (req, res) =>
  res.json(await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true }));

exports.remove = async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

exports.submit = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ message: 'Not found' });
  const answers = req.body.answers || []; // [{questionId, answer}]
  let score = 0, total = 0;
  const result = quiz.questions.map((q) => {
    total += q.marks;
    const a = answers.find((x) => String(x.questionId) === String(q._id));
    const isCorrect = a && String(a.answer).trim().toLowerCase() === String(q.correctAnswer || '').trim().toLowerCase();
    if (isCorrect) score += q.marks;
    return { questionId: q._id, answer: a?.answer || '', isCorrect: !!isCorrect };
  });
  const attempt = await QuizAttempt.create({
    quiz: quiz._id,
    student: req.user._id,
    answers: result,
    score, totalMarks: total,
    percent: total ? Math.round((score / total) * 100) : 0,
    passed: total ? score / total >= 0.5 : false,
  });
  res.status(201).json(attempt);
};

exports.myAttempts = async (req, res) =>
  res.json(await QuizAttempt.find({ student: req.user._id }).populate('quiz', 'title'));
