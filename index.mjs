import { cpus } from 'os';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import JestHasteMap from 'jest-haste-map';
import { Worker } from 'jest-worker';

// root path of the project (__dirname)
const root = dirname(fileURLToPath(import.meta.url));

const hasteMap = new JestHasteMap.default({
  extensions: ['js'],
  maxWorkers: cpus().length,
  name: 'bestjs',
  platforms: [],
  rootDir: root,
  roots: [root],
});

const { hasteFS } = await hasteMap.build();
const testFiles = hasteFS.matchFilesWithGlob([
  process.argv[2] ? `**/${process.argv[2]}*` : '**/*.test.js',
]);

const worker = new Worker(join(root, 'worker.js'));

let hasFailed = false;
await Promise.all(
  Array.from(testFiles).map(async (testFile) => {
    const { status, results, errorMessage } = await worker.runTest(testFile);
    const statusColor =
      status === 'success'
        ? chalk.green.inverse.bold(' PASS ')
        : chalk.red.inverse.bold(' FAIL ');

    console.log(`${statusColor} ${chalk.dim(relative(root, testFile))}`);

    if (status !== 'success') {
      hasFailed = true;

      if (results) {
        results
          .filter((result) => result.errors.length)
          .forEach((result) =>
            console.log(
              `${result.testPath.slice(1).join(' ')}\n${result.errors[0]}`
            )
          );
      } else if (errorMessage) {
        console.log(`  ${errorMessage}`);
      }
    }
  })
);

worker.end();
if (hasFailed) {
  console.log(
    '\n' + chalk.red.bold('Test run failed, please fix all the failing tests.')
  );

  // Set an exit code to indicate failure.
  process.exitCode = 1;
}
