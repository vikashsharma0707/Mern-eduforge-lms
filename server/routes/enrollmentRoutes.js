const router = require('express').Router();
const c = require('../controllers/enrollmentController');
const { protect } = require('../middlewares/auth');

router.get('/', protect, c.list);
router.post('/:courseId', protect, c.enroll);
router.put('/:courseId/lessons/:lessonId/complete', protect, c.markLessonComplete);


// routes/enrollmentRoutes.js
router.get('/enrollments', protect, c.list);
router.get('/enrollments/teacher', protect, c.teacherEnrollments); // optional

module.exports = router;
