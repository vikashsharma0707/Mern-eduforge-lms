// const router = require('express').Router();
// const c = require('../controllers/categoryController');
// const { protect, authorize } = require('../middlewares/auth');

// router.get('/', c.list);
// router.post('/', protect, authorize('admin'), c.create);
// router.put('/:id', protect, authorize('admin'), c.update);
// router.delete('/:id', protect, authorize('admin'), c.remove);

// module.exports = router;


const router = require('express').Router();

// Controller
const categoryController = require('../controllers/categoryController');

// Middleware
const { protect, authorize } = require('../middlewares/auth');

// ====================== Routes ======================

// Public Routes
router.get('/', categoryController.list);
router.get('/:id',       categoryController.get);            

// Admin Only Routes
router.post('/', protect, authorize('admin'), categoryController.create);
router.put('/:id', protect, authorize('admin'), categoryController.update);
router.delete('/:id', protect, authorize('admin'), categoryController.remove);

module.exports = router;