import { getClasses, createClass, bookClass, cancelBooking, getMyClasses } from '../controllers/classController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import express from 'express'

const router = express.Router();

router.get('/', getClasses);
router.get('/myclasses', protect, getMyClasses);
router.post('/', protect, authorize('admin', 'trainer'), createClass);
router.post('/:id/book', protect, bookClass);
router.delete('/:id/book', protect, cancelBooking);

export default router;
