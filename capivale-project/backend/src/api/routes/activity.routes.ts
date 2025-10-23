import { Router } from 'express';
import {
  createActivity,
  getAllActivities,
  updateActivity,
  deleteActivity,
  listActivitiesForUser,
  completeActivity,
} from '../controllers/activity.controller';
import { protect } from '../../middlewares/auth.middleware';
import { checkRole } from '../../middlewares/role.middleware';

const router = Router();

// User routes
router.get('/public/all', protect, listActivitiesForUser);
router.post('/:id/complete', protect, completeActivity);


// Admin routes for activities
router.post('/', [protect, checkRole(['admin'])], createActivity);
router.get('/', [protect, checkRole(['admin'])], getAllActivities);
router.put('/:id', [protect, checkRole(['admin'])], updateActivity);
router.delete('/:id', [protect, checkRole(['admin'])], deleteActivity);

export default router;
