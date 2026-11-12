import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Fetch all problems for this setter
    const problems = await prisma.problem.findMany({
      where: { authorId: userId },
      select: { status: true, difficulty: true }
    });

    const totalProblems = problems.length;
    
    // Calculate status counts
    const statusCounts = problems.reduce((acc: any, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});

    // Calculate difficulty counts
    const difficultyCounts = problems.reduce((acc: any, p) => {
      acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      totalProblems,
      statusCounts,
      difficultyCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
