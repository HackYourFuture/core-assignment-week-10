import fs from 'fs/promises';
import path from 'path';
import { startVitest } from 'vitest/node';

const __dirname = import.meta.dirname;
const reportPath = path.join(__dirname, 'report.json');

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

const reportContent = await fs.readFile(reportPath, 'utf-8');
await fs.unlink(reportPath);

try {
  const { testResults } = JSON.parse(reportContent);
  let maxPoints = 0;
  let earnedPoints = 0;

  console.log('\nVitest unit test results:\n');

  const passingScore = Number(process.env.PASSING_SCORE || 50);

  for (const result of testResults) {
    for (const { title, status } of result.assertionResults) {
      const match = title.match(/^\[(\d+)]/);
      const points = match ? Number(match[1]) || 1 : 1;
      maxPoints += points;
      let icon;
      if (status === 'passed') {
        icon = '✅';
        earnedPoints += points;
      } else {
        icon = '❌';
      }
      console.log(`${icon} ${title}`);
    }
  }

  console.log(`\nRating: ${earnedPoints} of ${maxPoints}`);

  const totalScore = (earnedPoints / maxPoints) * 100;

  const results = {
    score: totalScore,
    pass: totalScore >= passingScore,
    passingScore: passingScore,
  };

  await fs.writeFile('score.json', JSON.stringify(results, null, 2));
} catch (error) {
  console.error('Error parsing report JSON:', error);
  process.exit(1);
}
