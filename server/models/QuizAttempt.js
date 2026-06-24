const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    answers: [{ questionId: mongoose.Schema.Types.ObjectId, answer: String, isCorrect: Boolean }],
    score: Number,
    totalMarks: Number,
    percent: Number,
    passed: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
