/**
 * nary curried function and allows it to be called both as curried and n-ary.
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
 * const fn = nary(a => b => a + b);
 * fn('a')('b') === fn('a', 'b'); // => true
 */
export const nary = fn =>
    (...args) => args.length === 0
        ? fn()
        : args.reduce((accumulator, current) => accumulator(current), fn);

/**
 * curry takes n-ary function and allows it to be called both as curried and n-ary.
 *
 * @HindleyMilner curry :: (a -> b) -> a -> b
 *
 * @pure
 * @param {function} fn
 * @return {function}
 *
 * @example
 * import {curry} from '@7urtle/lambda';
 *
 * const fn = curry((a, b) => a + b);
 * fn('a')('b') === fn('a', 'b'); // => true
 */
export const curry = fn =>
    (...args) => args.length >= fn.length
        ? fn.apply(null, args)
        : (...args2) => curry(fn).apply(null, args.concat(args2));