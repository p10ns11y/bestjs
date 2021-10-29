const fs = require('fs');
const expect = require('expect');
const best = require('jest-mock');

exports.runTest = async function runTest(testFile) {
  const code = await fs.promises.readFile(testFile, 'utf-8');
  const testResult = {
    status: 'initial',
    errorMessage: null,
  };

  let testName;
  try {
    describeFunctions = [];
    let currentDescribeTestFunctions;
    const describe = (name, fn) => describeFunctions.push([name, fn]);
    const test = (name, fn) => currentDescribeTestFunctions.push([name, fn]);
    const it = test;
    eval(code);
    describeFunctions.forEach(([name, fn]) => {
      currentDescribeTestFunctions = [];
      testName = name;
      fn(); // call the decribe

      currentDescribeTestFunctions.forEach(([name, fn]) => {
        testName += ` ${name}`;
        fn(); // call test or it function
      });
    });
    testResult.status = 'success';
  } catch (error) {
    testResult.status = 'error';
    testResult.errorMessage = `${testName}: ${error.message}`;
  }

  return testResult;
};
