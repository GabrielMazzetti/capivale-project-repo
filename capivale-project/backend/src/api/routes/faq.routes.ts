import { Router } from 'express';
import * as faqController from '../../controllers/faq.controller'; // Import as a namespace
import { protect } from '../../middlewares/auth.middleware'; // Changed from authenticateToken to protect
import { checkRole } from '../../middlewares/role.middleware';

console.log('faqController.createQuestion:', faqController.createQuestion); // Add this line

const router = Router();

// Public routes for fetching FAQs
router.get('/', (req, res) => faqController.getAllQuestions(req, res));
router.get('/:id', (req, res) => faqController.getQuestionById(req, res));

// Admin-only routes for managing FAQs
router.post('/', protect, checkRole(['admin']), (req, res) => faqController.createQuestion(req, res));
router.put('/:id', protect, checkRole(['admin']), (req, res) => faqController.updateQuestion(req, res));
router.delete('/:id', protect, checkRole(['admin']), (req, res) => faqController.deleteQuestion(req, res));

export default router;