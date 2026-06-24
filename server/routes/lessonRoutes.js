const router = require('express').Router();
const c = require('../controllers/lessonController');
const { protect, authorize } = require('../middlewares/auth');
const { uploadCourse } = require('../config/multer');

router.get('/course/:courseId', c.listByCourse);
router.get('/:id', c.get);
router.post('/', protect, authorize('teacher', 'admin'), uploadCourse.single('video'), c.create);
router.put('/:id', protect, authorize('teacher', 'admin'), uploadCourse.single('video'), c.update);
router.delete('/:id', protect, authorize('teacher', 'admin'), c.remove);

module.exports = router;
