const router = require('express').Router();
const c = require('../controllers/notificationController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', protect, c.list);
router.put('/:id/read', protect, c.markRead);
router.put('/read/all', protect, c.markAllRead);
router.post('/', protect, authorize('admin'), c.create);

module.exports = router;
