const router = require('express').Router();
const c = require('../controllers/quizController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/course/:courseId', protect, c.listByCourse);
router.get('/me/attempts', protect, c.myAttempts);
router.get('/:id', protect, c.get);
router.post('/', protect, authorize('teacher', 'admin'), c.create);
router.put('/:id', protect, authorize('teacher', 'admin'), c.update);
router.delete('/:id', protect, authorize('teacher', 'admin'), c.remove);
router.post('/:id/submit', protect, c.submit);

module.exports = router;
