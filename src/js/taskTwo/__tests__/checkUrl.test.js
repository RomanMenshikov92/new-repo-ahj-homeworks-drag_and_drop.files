import checkUrl from '../checkUrl';

test.each([
  ['image/jpeg', true],
  ['image/png', true],
  ['1a', false],
  [1, false],
  [1.1, false],
  ['1,1', false],
])(
  ('test checkUrl image'),
  (number, expected) => {
    const received = checkUrl(number);

    expect(received).toEqual(expected);
  },
);
