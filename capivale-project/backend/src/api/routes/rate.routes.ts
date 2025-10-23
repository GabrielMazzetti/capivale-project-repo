import { Router } from 'express';
import { getLatestCapivaleBRLRate } from '../controllers/rate.controller';

const router = Router();

router.get('/capivale-brl', getLatestCapivaleBRLRate);

export default router;
