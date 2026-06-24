// const Enrollment = require('../models/Enrollment');
// const Course = require('../models/Course');
// const Lesson = require('../models/Lesson');

// exports.enroll = async (req, res) => {
//   const courseId = req.params.courseId;
//   const course = await Course.findById(courseId);
//   if (!course) return res.status(404).json({ message: 'Course not found' });
//   const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
//   if (existing) return res.json(existing);
//   const enrollment = await Enrollment.create({ student: req.user._id, course: courseId });
//   course.enrollmentCount += 1;
//   await course.save();
//   res.status(201).json(enrollment);
// };

// exports.list = async (req, res) => {
//   const filter = req.user.role === 'admin' ? {} : { student: req.user._id };
//   const enrolls = await Enrollment.find(filter).populate('course').populate('student', 'name email');
//   res.json(enrolls);
// };

// exports.markLessonComplete = async (req, res) => {
//   const { courseId, lessonId } = req.params;
//   const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
//   if (!enrollment) return res.status(404).json({ message: 'Not enrolled' });
//   if (!enrollment.completedLessons.map(String).includes(lessonId)) {
//     enrollment.completedLessons.push(lessonId);
//   }
//   const total = await Lesson.countDocuments({ course: courseId });
//   enrollment.progress = total ? Math.round((enrollment.completedLessons.length / total) * 100) : 0;
//   if (enrollment.progress === 100 && !enrollment.completedAt) enrollment.completedAt = new Date();
//   await enrollment.save();
//   res.json(enrollment);
// };



const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

exports.enroll = async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
  if (existing) return res.json(existing);

  const enrollment = await Enrollment.create({ 
    student: req.user._id, 
    course: courseId 
  });

  course.enrollmentCount = (course.enrollmentCount || 0) + 1;
  await course.save();

  res.status(201).json(enrollment);
};

exports.list = async (req, res) => {
  let filter = {};

  if (req.user.role === 'admin') {
    filter = {};                    // Admin can see all
  } 
  else if (req.user.role === 'student') {
    filter = { student: req.user._id };   // Student sees only their own
  } 
  else if (req.user.role === 'teacher') {
    // Teacher sees enrollments of courses they own
    const teacherCourses = await Course.find({ teacher: req.user._id }).select('_id');
    const courseIds = teacherCourses.map(c => c._id);
    
    filter = { course: { $in: courseIds } };
  }

  const enrolls = await Enrollment.find(filter)
    .populate('course', 'title slug')
    .populate('student', 'name email');

  res.json(enrolls);
};

// New endpoint for teacher (optional but recommended)
exports.teacherEnrollments = async (req, res) => {
  try {
    const teacherCourses = await Course.find({ teacher: req.user._id }).select('_id');
    const courseIds = teacherCourses.map(c => c._id);

    const enrolls = await Enrollment.find({ course: { $in: courseIds } })
      .populate('course', 'title')
      .populate('student', 'name email');

    res.json(enrolls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markLessonComplete = async (req, res) => {
  const { courseId, lessonId } = req.params;
  const enrollment = await Enrollment.findOne({ 
    student: req.user._id, 
    course: courseId 
  });

  if (!enrollment) return res.status(404).json({ message: 'Not enrolled' });

  if (!enrollment.completedLessons.map(String).includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
  }

  const total = await Lesson.countDocuments({ course: courseId });
  enrollment.progress = total 
    ? Math.round((enrollment.completedLessons.length / total) * 100) 
    : 0;

  if (enrollment.progress === 100 && !enrollment.completedAt) {
    enrollment.completedAt = new Date();
  }

  await enrollment.save();
  res.json(enrollment);
};