import { Router } from 'express';
import * as merchantController from '../../controllers/merchant.controller';
import { protect } from '../../middlewares/auth.middleware';
import { checkRole } from '../../middlewares/role.middleware';

const router = Router();

// All merchant routes are protected and require the 'merchant' role
router.use(protect, checkRole(['merchant']));

router.get('/dashboard', merchantController.getDashboardData);

// Profile Management Routes
router.get('/profile', merchantController.getProfile);
router.put('/profile', merchantController.updateProfile);

// Product Management Routes
router.post('/products', merchantController.createProduct);
router.get('/products', merchantController.getProducts);
router.get('/products/:id', merchantController.getProductById);
router.put('/products/:id', merchantController.updateProduct);
router.delete('/products/:id', merchantController.deleteProduct);

// Sales Management Routes
router.post('/sales/register', merchantController.registerSale);
router.get('/sales', merchantController.getSalesHistory); // This already exists, but I'll keep it here for context

router.post('/payment-request', merchantController.generatePaymentRequest);

export default router;
