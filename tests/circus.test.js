describe('circus test', () => {
  test('works', () => {
    expect(1).toBe(1);
  });
});

describe('another circus test', () => {
  test(`doesn't work`, () => {
    expect(1).toBe(2);
  });
});
