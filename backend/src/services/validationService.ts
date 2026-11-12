import prisma from '../utils/prisma';

export const validateProblemService = async (problemId: number) => {
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    include: { testCases: true }
  });

  if (!problem) {
    throw new Error('Problem not found');
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Check for missing metadata
  if (!problem.title || problem.title.trim() === '') errors.push('Title is missing.');
  if (!problem.description || problem.description.trim() === '') errors.push('Description is missing.');
  if (!problem.inputFormat || problem.inputFormat.trim() === '') errors.push('Input format is missing.');
  if (!problem.outputFormat || problem.outputFormat.trim() === '') errors.push('Output format is missing.');
  if (!problem.constraints || problem.constraints.trim() === '') errors.push('Constraints are missing.');

  // 2. Check test cases
  if (problem.testCases.length === 0) {
    errors.push('No test cases provided. At least one test case is required.');
  } else {
    // Check for duplicates
    const seen = new Set<string>();
    let duplicatesFound = 0;

    for (const tc of problem.testCases) {
      const key = `${tc.input.trim()}|||${tc.output.trim()}`;
      if (seen.has(key)) {
        duplicatesFound++;
      }
      seen.add(key);
    }

    if (duplicatesFound > 0) {
      errors.push(`Found ${duplicatesFound} duplicate test case(s). Please remove them.`);
    }

    // Check for public samples
    const hasPublic = problem.testCases.some(tc => tc.isPublic);
    if (!hasPublic) {
      warnings.push('No public test cases provided. Contestants will not see any sample inputs/outputs.');
    }
  }

  return {
    problemId,
    isValid: errors.length === 0,
    errors,
    warnings,
    checkedAt: new Date().toISOString()
  };
};
