//Script to run linting checks manually via 'npm run lint-check'

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to save lint reports
const reportsDir = path.join(__dirname, '../lint-reports');

// Create reports directory if it doesn't exist
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

/**
 * Run ESLint and save results to a file
 */
function runLintCheck() {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const reportFile = path.join(reportsDir, `lint-report-${timestamp}.sh`);

  console.log(`Running lint check at ${new Date().toLocaleString()}...`);

  // Execute ESLint
  exec('npm run lint', (err, stdout, stderr) => {
    const output = stdout || stderr;

    // Save the output to a file
    fs.writeFileSync(reportFile, output);

    // Log results
    if (err) {
      console.error('ESLint found issues:');
      console.log(output);
    } else {
      console.log('ESLint check passed!');
    }
  });

  // Run Prettier check too
  exec('npx prettier --check "**/*.{js,jsx,ts,tsx,json,md}"', (err, stdout, stderr) => {
    const output = stdout || stderr;
    fs.appendFileSync(reportFile, '\n\n---- PRETTIER CHECK ----\n' + output);

    if (err) {
      console.error('Prettier found formatting issues:');
      console.log(output);
    } else {
      console.log('Prettier check passed!');
    }
  });
}

// If this script is run directly, execute a lint check immediately
runLintCheck();

export { runLintCheck };
