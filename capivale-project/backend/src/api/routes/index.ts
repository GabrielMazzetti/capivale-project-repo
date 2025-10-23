import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import walletRoutes from './wallet.routes';
import merchantRoutes from './merchant.routes';
import adminRoutes from './admin.routes';
import faqRoutes from './faq.routes';
import rateRoutes from './rate.routes';
import categoryRoutes from './category.routes'; // Add this import
import activityRoutes from './activity.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/wallet', walletRoutes);
router.use('/merchants', merchantRoutes);
router.use('/admin', adminRoutes);
router.use('/faqs', faqRoutes);
router.use('/rates', rateRoutes);
router.use('/categories', categoryRoutes); // Add this line
router.use('/activities', activityRoutes);

export default router;
