const router = require('express').Router();
const c = require('../controllers/certificateController');
const { protect } = require('../middlewares/auth');

router.post('/issue/:courseId', protect, c.issue);
router.get('/me', protect, c.my);
router.get('/verify/:serial', c.verify);

module.exports = router;
