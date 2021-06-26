import * as λ from '../src';

test('nary takes curried function and allows it to be called both as curried and n-ary.', () => {
    const fn1 = λ.nary(a => b => a + b);
    expect(fn1('a')('b')).toBe(fn1('a', 'b'));
    expect(fn1('a')('b')).toBe('ab');
});

test('curry takes n-ary function and allows it to be called both as curried and n-ary.', () => {
    const fn = λ.curry((a, b, c) => a + (b / c));
    expect(fn(2, 4, 2)).toBe(fn(2)(4)(2));
    expect(fn(2)(4)(2)).toBe(4);
});