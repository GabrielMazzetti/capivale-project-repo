import { Router } from 'express';
// import * as userController from '../../controllers/user.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

// Example of a protected route
router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

export default router;
