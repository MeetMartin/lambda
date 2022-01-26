import * as λ from '../src/index.js';

test('nary takes curried function and allows it to be called both as curried and n-ary.', () => {
    const fn1 = λ.nary(a => b => a + b);
    expect(fn1('a')('b')).toBe(fn1('a', 'b'));
    expect(fn1('a')('b')).toBe('ab');
    expect(λ.nary(() => 5)()).toBe(5);
});

test('curry takes n-ary function and allows it to be called both as curried and n-ary.', () => {
    const fn = λ.curry((a, b, c) => a + (b / c));
    expect(fn(2, 4, 2)).toBe(fn(2)(4)(2));
    expect(fn(2)(4)(2)).toBe(4);
    expect(λ.curry(() => 5)()).toBe(5);
});