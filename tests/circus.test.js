describe('circus test', () => {
  test('works', () => {
    expect(1).toBe(1);
  });
});

describe('another circus test', () => {
  test(`doesn't work`, async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    expect(1).toBe(2);
  });
});
