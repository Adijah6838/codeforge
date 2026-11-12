import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const updateProblemStatus = async (req: AuthRequest, res: Response) => {
  try {
    const problemId = Number(req.params.id);
    const { status } = req.body;
    const userRole = req.user?.role;
    const userId = req.user?.userId;

    const problem = await prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    if (userRole === 'PROBLEM_SETTER' && problem.authorId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (['APPROVED', 'CHANGES_REQUESTED'].includes(status) && !['SENIOR_REVIEWER', 'TECHNICAL_REVIEWER', 'ADMIN'].includes(userRole as string)) {
      return res.status(403).json({ error: 'Only reviewers can approve or request changes' });
    }

    if (status === 'PUBLISHED' && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can publish problems' });
    }

    const updatedProblem = await prisma.problem.update({
      where: { id: problemId },
      data: { status },
    });

    res.status(200).json({ message: `Status updated to ${status}`, problem: updatedProblem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addReviewComment = async (req: AuthRequest, res: Response) => {
  try {
    const problemId = Number(req.params.id);
    const { comment } = req.body;
    const reviewerId = req.user?.userId;

    if (!comment) return res.status(400).json({ error: 'Comment text is required' });

    const reviewComment = await prisma.reviewComment.create({
      data: { problemId, reviewerId: reviewerId as number, comment },
    });

    res.status(201).json({ message: 'Comment added', reviewComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
