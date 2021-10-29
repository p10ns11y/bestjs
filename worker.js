const fs = require('fs');
const expect = require('expect');
const best = require('jest-mock');
const { describe, test, it, run, resetState } = require('jest-circus');

exports.runTest = async function runTest(testFile) {
  const code = await fs.promises.readFile(testFile, 'utf-8');
  const testResult = {
    status: 'initial',
    errorMessage: null,
  };

  try {
    resetState();
    eval(code);
    const { testResults } = await run();

    testResult.results = testResults;

    const allTestsPassed = testResults.every((result) =>
      Boolean(!result.errors.length)
    );

    if (allTestsPassed) {
      testResult.status = 'success';
    } else {
      testResult.status = 'error';
    }
  } catch (error) {
    testResult.status = 'error';
    testResult.errorMessage = error.message;
  }

  return testResult;
};
