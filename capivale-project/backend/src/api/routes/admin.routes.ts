import { Router } from 'express';
import * as adminController from '../../controllers/admin.controller';
import { protect } from '../../middlewares/auth.middleware';
import { checkRole } from '../../middlewares/role.middleware';

const router = Router();

// Protect all admin routes and ensure the user has the 'admin' role
router.use(protect, checkRole(['admin']));

router.get('/stats', adminController.getPlatformStats);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/status', adminController.updateUserStatus);
router.get('/transactions', adminController.getAllTransactions);
router.post('/mint', adminController.mintTokens);

export default router;
