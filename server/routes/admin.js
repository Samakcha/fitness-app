import express from 'express'
import { getAllUsers, getAllPlans, createPlan, deletePlan, updateUserRole } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// User Management
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);

// Plan Management
router.get('/plans', getAllPlans); // Public reading
router.post('/plans', protect, authorize('admin'), createPlan);
router.delete('/plans/:id', protect, authorize('admin'), deletePlan);

export default router
