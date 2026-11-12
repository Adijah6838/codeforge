import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { validateProblemService } from '../services/validationService';
import prisma from '../utils/prisma';

export const runValidation = async (req: AuthRequest, res: Response) => {
  try {
    const problemId = Number(req.params.id);
    const userId = req.user?.userId;

    const problem = await prisma.problem.findUnique({ where: { id: problemId } });
    
    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    if (problem.authorId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const report = await validateProblemService(problemId);
    res.status(200).json({ report });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
