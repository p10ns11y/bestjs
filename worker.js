const fs = require('fs');

exports.runTest = async function runTest(testFile) {
  const code = await fs.promises.readFile(testFile, 'utf-8');
  const testResult = {
    status: 'initial',
    errorMessage: null,
  };

  try {
    function expect(received) {
      return {
        toBe(expected) {
          if (received !== expected) {
            throw new Error(`Expected ${expected} but received ${received}.`);
          }
          return true;
        },
      };
    }
    eval(code);
    testResult.status = 'success';
  } catch (error) {
    testResult.status = 'error';
    testResult.errorMessage = error.message;
  }

  return testResult;
};
