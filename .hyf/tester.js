import fs from 'fs/promises';
import { startVitest } from 'vitest/node';
import path from 'path';

const __dirname = import.meta.dirname;
const reportPath = path.join(__dirname, 'report.json');
const reportFileName = 'report.json';

await startVitest(
  'test',
  [], // CLI filters
  {
    include: ['../**/*.test.js'],
    reporters: ['json'],
    outputFile: reportPath,
    watch: false,
  }, // override test config
  {}, // override Vite config
  {} // custom Vitest options
);

const reportContent = await fs.readFile(reportFileName, 'utf-8');
await fs.unlink(reportFileName);

try {
  const { testResults } = JSON.parse(reportContent);
  let testCount = 0;
  let passedCount = 0;

  for (const result of testResults) {
    for (const assertionResult of result.assertionResults) {
      const { title, status } = assertionResult;
      let icon;
      if (status == 'passed') {
        icon = '✅';
        passedCount++;
      } else {
        icon = '❌';
      }
      console.log(`${icon} ${title}`);
      testCount++;
    }
  }

  const PASSING_SCORE = 50;
  const totalScore = (passedCount / testCount) * 100;

  const results = {
    score: totalScore,
    pass: totalScore >= PASSING_SCORE,
    passingScore: PASSING_SCORE,
  };

  await fs.writeFile('score.json', JSON.stringify(results, null, 2));
} catch (error) {
  console.error('Error parsing report JSON:', error);
  process.exit(1);
}
