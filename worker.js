const fs = require('fs');
const expect = require('expect');
const best = require('jest-mock');

exports.runTest = async function runTest(testFile) {
  const code = await fs.promises.readFile(testFile, 'utf-8');
  const testResult = {
    status: 'initial',
    errorMessage: null,
  };

  try {
    eval(code);
    testResult.status = 'success';
  } catch (error) {
    testResult.status = 'error';
    testResult.errorMessage = error.message;
  }

  return testResult;
};
