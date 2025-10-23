import { Router } from 'express';
import * as authController from '../../controllers/auth.controller';
import { protect } from '../../middlewares/auth.middleware'; // Add this line

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// New route to get authenticated user's data
router.get('/me', protect, (req, res) => {
  // req.user is set by the protect middleware
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'User not authenticated' });
  }
});

export default router;
