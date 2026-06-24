const router = require('express').Router();
const c = require('../controllers/ragController');
const { protect } = require('../middlewares/auth');
const { uploadNote } = require('../config/multer');

router.post('/upload', protect, uploadNote.single('file'), c.upload);
router.get('/documents', protect, c.list);
router.post('/ask', protect, c.ask);
router.delete('/documents/:id', protect, c.remove);

module.exports = router;
