import { Router } from 'express';
// import * as walletController from '../../controllers/wallet.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protect);

// router.get('/balance', walletController.getBalance);
// router.get('/transactions', walletController.getTransactions);

export default router;
