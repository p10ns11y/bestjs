import fs from 'fs';
import { cpus } from 'os';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import JestHasteMap from 'jest-haste-map';

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

await Promise.all(
  Array.from(testFiles).map(async (testFile) => {
    const code = await fs.promises.readFile(testFile, 'utf-8');
    console.log(testFile + ':\n' + code);
  })
);
