const router = require('express').Router();
const c = require('../controllers/courseController');
const { protect, authorize } = require('../middlewares/auth');
const { uploadCourse } = require('../config/multer');

router.get('/', c.list);
router.get('/me/owned', protect, c.myCourses);
router.get('/:slug', c.get);
router.post('/', protect, authorize('teacher', 'admin'), uploadCourse.single('thumbnail'), c.create);
router.put('/:id', protect, authorize('teacher', 'admin'), uploadCourse.single('thumbnail'), c.update);
router.delete('/:id', protect, authorize('teacher', 'admin'), c.remove);

module.exports = router;
