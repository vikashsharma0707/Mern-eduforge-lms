const router = require('express').Router();
const c = require('../controllers/assignmentController');
const { protect, authorize } = require('../middlewares/auth');
const { uploadAssignment, uploadSubmission } = require('../config/multer');

router.get('/course/:courseId', protect, c.listByCourse);
router.post('/', protect, authorize('teacher', 'admin'), uploadAssignment.single('file'), c.create);
router.put('/:id', protect, authorize('teacher', 'admin'), c.update);
router.delete('/:id', protect, authorize('teacher', 'admin'), c.remove);

router.post('/:id/submit', protect, uploadSubmission.single('file'), c.submit);
router.get('/:id/submissions', protect, c.listSubmissions);
router.put('/submissions/:subId/grade', protect, authorize('teacher', 'admin'), c.grade);
router.post('/submissions/:subId/ai-grade', protect, authorize('teacher', 'admin'), c.aiGrade);

module.exports = router;
