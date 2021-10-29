const fs = require('fs');
const vm = require('vm');
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
    const context = {
      describe,
      test,
      it,
      expect,
      best,
    };
    vm.createContext(context);
    vm.runInContext(code, context);

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
