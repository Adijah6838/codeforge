import { Router } from 'express';
import { createProblem, getMyProblems, addTestCase } from '../controllers/problemController';
import { runValidation } from '../controllers/validationController';
import { updateProblemStatus, addReviewComment } from '../controllers/workflowController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.post('/', createProblem);
router.get('/my-problems', getMyProblems);
router.post('/:id/test-cases', addTestCase);
router.get('/:id/validate', runValidation);

// Workflow Routes
router.patch('/:id/status', updateProblemStatus);
router.post('/:id/comments', addReviewComment);

export default router;
