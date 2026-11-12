import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const createProblem = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, inputFormat, outputFormat, constraints, difficulty } = req.body;
    const authorId = req.user?.userId;

    if (!authorId) return res.status(401).json({ error: 'Unauthorized' });

    const problem = await prisma.$transaction(async (tx) => {
      const newProblem = await tx.problem.create({
        data: { title, description, inputFormat, outputFormat, constraints, difficulty: difficulty || 'EASY', authorId },
      });

      await tx.problemVersion.create({
        data: { problemId: newProblem.id, title: newProblem.title, description: newProblem.description, snapshot: JSON.stringify(newProblem) },
      });

      return newProblem;
    });

    res.status(201).json({ message: 'Problem created successfully', problem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyProblems = async (req: AuthRequest, res: Response) => {
  try {
    const authorId = req.user?.userId;
    const problems = await prisma.problem.findMany({
      where: { authorId },
      include: { _count: { select: { testCases: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ problems });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addTestCase = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { input, output, isPublic } = req.body;
    const userId = req.user?.userId;

    const problem = await prisma.problem.findUnique({ where: { id: Number(id) } });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    if (problem.authorId !== userId && req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

    const testCase = await prisma.testCase.create({
      data: { problemId: Number(id), input, output, isPublic: isPublic || false },
    });

    res.status(201).json({ message: 'Test case added', testCase });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
