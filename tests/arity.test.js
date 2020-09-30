import * as λ from '../src';

test('nary takes input of a curried function and allows it to be called both as curried and n-ary.', () => {
    const fn1 = λ.nary(a => b => a + b);
    expect(fn1('a')('b')).toBe(fn1('a', 'b'));
});