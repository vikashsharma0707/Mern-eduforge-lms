// const Course = require('../models/Course');
// const Lesson = require('../models/Lesson');
// const Enrollment = require('../models/Enrollment');

// const slugify = (s) =>
//   s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

// exports.list = async (req, res) => {
//   const { q, category, level, published } = req.query;
//   const filter = {};
//   if (q) filter.title = new RegExp(q, 'i');
//   if (category) filter.category = category;
//   if (level) filter.level = level;
//   if (published === 'true') filter.isPublished = true;
//   const courses = await Course.find(filter).populate('teacher', 'name avatar').populate('category', 'name');
//   res.json(courses);
// };

// exports.get = async (req, res) => {
//   const course = await Course.findOne({ slug: req.params.slug })
//     .populate('teacher', 'name avatar bio')
//     .populate('category', 'name');
//   if (!course) return res.status(404).json({ message: 'Course not found' });
//   const lessons = await Lesson.find({ course: course._id }).sort({ position: 1 });
//   res.json({ course, lessons });
// };

// exports.create = async (req, res) => {
//   const data = { ...req.body, teacher: req.user._id };
//   data.slug = data.slug || slugify(`${data.title}-${Date.now()}`);
//   if (req.file) data.thumbnail = `/uploads/courses/${req.file.filename}`;
//   const course = await Course.create(data);
//   res.status(201).json(course);
// };

// exports.update = async (req, res) => {
//   const course = await Course.findById(req.params.id);
//   if (!course) return res.status(404).json({ message: 'Not found' });
//   if (req.user.role !== 'admin' && String(course.teacher) !== String(req.user._id))
//     return res.status(403).json({ message: 'Forbidden' });
//   Object.assign(course, req.body);
//   if (req.file) course.thumbnail = `/uploads/courses/${req.file.filename}`;
//   await course.save();
//   res.json(course);
// };

// exports.remove = async (req, res) => {
//   const course = await Course.findById(req.params.id);
//   if (!course) return res.status(404).json({ message: 'Not found' });
//   if (req.user.role !== 'admin' && String(course.teacher) !== String(req.user._id))
//     return res.status(403).json({ message: 'Forbidden' });
//   await Lesson.deleteMany({ course: course._id });
//   await course.deleteOne();
//   res.json({ message: 'Deleted' });
// };

// exports.myCourses = async (req, res) => {
//   if (req.user.role === 'teacher' || req.user.role === 'admin') {
//     const courses = await Course.find({ teacher: req.user._id });
//     return res.json(courses);
//   }
//   const enrolls = await Enrollment.find({ student: req.user._id }).populate({
//     path: 'course',
//     populate: { path: 'teacher', select: 'name avatar' },
//   });
//   res.json(enrolls);
// };


const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

// Allowed fields for update (security ke liye)
const allowedUpdates = [
  'title', 'description', 'category', 'level', 'price',
  'isPublished', 'thumbnail', 'whatYouWillLearn', 'requirements'
];

exports.list = async (req, res) => {
  try {
    const { q, category, level } = req.query;

    const filter = { isPublished: true };   // Students ko sirf published courses dikhenge

    if (q) filter.title = new RegExp(q, 'i');
    if (category) filter.category = category;
    if (level) filter.level = level;

    const courses = await Course.find(filter)
      .populate('teacher', 'name avatar')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.get = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('teacher', 'name avatar bio')
      .populate('category', 'name');

    if (!course) return res.status(404).json({ message: 'Course not found' });

    const lessons = await Lesson.find({ course: course._id }).sort({ position: 1 });

    res.json({ course, lessons });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    let data = { 
      ...req.body, 
      teacher: req.user._id,
      isPublished: false   // Default draft mode
    };

    // Slug handling
    if (!data.slug) {
      data.slug = slugify(data.title);
    } else {
      data.slug = slugify(data.slug);
    }

    if (req.file) {
      data.thumbnail = `/uploads/courses/${req.file.filename}`;
    }

    const course = await Course.create(data);

    res.status(201).json({
      course,
      message: "Course created as Draft. Publish it when ready."
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Ownership check
    if (req.user.role !== 'admin' && String(course.teacher) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Safe update - only allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        course[key] = req.body[key];
      }
    });

    if (req.file) {
      course.thumbnail = `/uploads/courses/${req.file.filename}`;
    }

    await course.save();

    res.json({ 
      course,
      message: course.isPublished ? "Course Published Successfully!" : "Draft Saved Successfully"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.role !== 'admin' && String(course.teacher) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Lesson.deleteMany({ course: course._id });
    await course.deleteOne();

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.myCourses = async (req, res) => {
  try {
    let result;

    if (req.user.role === 'teacher' || req.user.role === 'admin') {
      // Teacher/Admin - unke saare courses (draft + published)
      result = await Course.find({ teacher: req.user._id })
        .populate('category', 'name')
        .sort({ createdAt: -1 });
    } else {
      // Student - enrolled courses
      result = await Enrollment.find({ student: req.user._id })
        .populate({
          path: 'course',
          populate: { path: 'teacher', select: 'name avatar' }
        })
        .sort({ enrolledAt: -1 });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};