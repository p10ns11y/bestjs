const fs = require('fs');
const vm = require('vm');
const expect = require('expect');
const best = require('jest-mock');
const NodeEnvironment = require('jest-environment-node');
const { describe, test, it, run, resetState } = require('jest-circus');

exports.runTest = async function runTest(testFile) {
  const code = await fs.promises.readFile(testFile, 'utf-8');
  const testResult = {
    status: 'initial',
    errorMessage: null,
  };

  try {
    resetState();
    const environment = new NodeEnvironment({
      testEnvironmentOptions: {
        describe,
        test,
        it,
        expect,
        best,
      },
    });
    vm.runInContext(code, environment.getVmContext());

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
