import glob from 'glob';

const testFiles = glob.sync('**/*.test.js');

console.log(testFiles);
