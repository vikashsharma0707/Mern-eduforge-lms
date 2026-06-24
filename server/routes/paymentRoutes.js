const router = require('express').Router();
const c = require('../controllers/paymentController');
const { protect } = require('../middlewares/auth');

router.post('/create-order', protect, c.createOrder);
router.post('/verify', protect, c.verify);
router.post('/webhook', c.webhook);
router.get('/history', protect, c.history);

module.exports = router;
