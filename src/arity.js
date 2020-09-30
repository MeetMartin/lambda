/**
 * nary takes input of a curried function and allows it to be called both as curried and n-ary.
 *
 * @HindleyMilner nary :: (a -> b) -> a -> b
 *
 * @pure
 * @param {function} fn
 * @return {function}
 *
 * @example
 * import {nary} from '@7urtle/lambda';
 *
 * const fn1 = nary(a => b => a + b);
 * fn1('a')('b') === fn1('a', 'b'); // => true
 */
export const nary = fn =>
    (...args) => args.length === 0
        ? fn()
        : args.reduce((accumulator, current) => accumulator(current), fn);