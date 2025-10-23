import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { protect } from '../../middlewares/auth.middleware';
import { checkRole } from '../../middlewares/role.middleware';

const router = Router();

// Public route for getting all categories (accessible by anyone, including merchants)
router.get('/', categoryController.getCategories);

// All other category routes require admin role for management
router.use(protect, checkRole(['admin']));

router.post('/', categoryController.createCategory);
router.get('/:id', categoryController.getCategoryById); // This will now be protected by admin role
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
