import { cpus } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import JestHasteMap from 'jest-haste-map';
import { Worker } from 'jest-worker';

// root path of the project (__dirname)
const root = dirname(fileURLToPath(import.meta.url));

const hasteMap = new JestHasteMap.default({
  extensions: ['js'],
  maxWorkers: cpus().length,
  name: 'best-test-framework',
  platforms: [],
  rootDir: root,
  roots: [root],
});

const { hasteFS } = await hasteMap.build();
const testFiles = hasteFS.matchFilesWithGlob(['**/*.test.js']);

const worker = new Worker(join(root, 'worker.js'));

await Promise.all(
  Array.from(testFiles).map(async (testFile) => {
    const testResult = await worker.runTest(testFile);
    console.log(testResult);
  })
);

worker.end();
