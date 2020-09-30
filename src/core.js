import {reduce, reduceRight} from './list';
import {isString, isArray, isObject} from './conditional';
import {minusOneToUndefined, passThrough} from './utils';
import {nary} from "./arity";

/**
 * identity is a function that simply passes its input to its output without changing it.
 *
 * @HindleyMilner identity :: a -> a
 *
 * @pure
 * @param {*} anything
 * @return {*}
 *
 * @example
 * import {identity} from '@7urtle/lambda';
 *
 * identity('anything');
 * // => anything
 */
export const identity = anything => anything;

/**
 * compose is a right-to-left function composition
 * where each function receives input and hands over its output to the next function.
 *
 * compose executes functions in reverse order to pipe.
 *
 * compose(f,g)(x) is equivalent to f(g(x)).
 *
 * @HindleyMilner compose :: [(a -> b)] -> a -> (a -> b)
 *
 * @pure
 * @param {function} fns
 * @param {*} anything
 * @return {*}
 *
 * @example
 * import {compose} from '@7urtle/lambda';
 *
 * const addA = a => a + 'A';
 * const addB = a => a + 'B';
 * const addAB = compose(addA, addB);
 *
 * addAB('Order: ');
 * // => Order: BA
 */
export const compose = (...fns) => anything => reduceRight(anything)((v, f) => f(v))(fns);

/**
 * pipe output is a left-to-right function composition
 * where each function receives input and hands over its output to the next function.
 *
 * pipe executes functions in reverse order to compose.
 *
 * pipe(f,g)(x) is equivalent to g(f(x)).
 *
 * @HindleyMilner pipe :: [(a -> b)] -> a -> (a -> b)
 *
 * @pure
 * @param {function} fns
 * @param {*} anything
 * @return {*}
 *
 * @example
 * import {pipe} from '@7urtle/lambda';
 *
 * const addA = a => a + 'A';
 * const addB = a => a + 'B';
 * const addAB = pipe(addA, addB);
 *
 * addAB('Order: ');
 * // => Order: AB
 */
export const pipe = (...fns) => anything => reduce(anything)((v, f) => f(v))(fns);

/**
 * map maps function over inputted functor outputting resulting functor.
 * map executes input mapper the input array or functor to output new array or functor.
 *
 * In case of monads, you should use map when you want to work with functors using functions
 * and functional composition rather than calling Functor.map.
 *
 * map can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner map :: (a -> b) -> a -> b
 *
 * @param {function} fn
 * @param {array|functor} target
 * @return {array|functor}
 *
 * @example
 * import {map, Maybe, upperCaseOf} from '@7urtle/lambda';
 *
 * const mapper = a => a + 'm';
 * const list = ['a', 'b', 'c'];
 *
 * // the function mapper is applied to each member of the array
 * map(mapper)(list); // => ['am', 'bm', 'cm']
 *
 * // the function upperCaseOf is applied to the value of the functor
 * map(upperCaseOf)(Maybe.of('something')); // => Just('SOMETHING')
 *
 * // use of map equals the use of map on the functor
 * map(upperCaseOf)(Maybe.of('something')).value === Maybe.of('something').map(upperCaseOf).value;
 *
 * // map can be called both as a curried unary function or as a standard binary function
 * map(upperCaseOf)(Maybe.of('something')).value === map(upperCaseOf, Maybe.of('something')).value;
 */
export const map = nary(mapper => list => list.map(mapper));

/**
 * flatMap maps function over inputted functor outputting resulting flattened functor.
 *
 * You should use flatMap when you want to work with functors using functions
 * and functional composition rather than calling flatMaps.
 *
 * The function can be called both as a unary flatMap(fn)(functor) and binary flatMap(fn, functor).
 *
 * @HindleyMilner flatMap :: (a -> Functor) -> Functor -> Functor
 *
 * @param {function} fn
 * @param {functor} functor
 * @return {functor}
 *
 * @example
 * import {flatMap, map, Maybe} from '@7urtle/lambda';
 *
 * const maybePlus2 = number => Maybe.of(number + 2);
 *
 * // the function maybePlus2 is applied to the value of the functor
 * flatMap(maybePlus2)(Maybe.of(3)); // => Just(5)
 * map(maybePlus2)(Maybe.of(3)); // => Just(Just(5))
 *
 * // use of flatMap equals the use of flatMap on the functor
 * flatMap(maybePlus2)(Maybe.of(3)).value === Maybe.of(3).flatMap(maybePlus2).value;
 *
 * // flatMap can be called both as a curried unary function or as a standard binary function
 * flatMap(maybePlus2)(Maybe.of(3)).value === flatMap(maybePlus2, Maybe.of(3)).value;
 */
export const flatMap = nary(fn => functor => functor.flatMap(fn));

/**
 * liftA2 provides point-free way of writing calls over applicative functors and functions expecting 2 inputs. It
 * applies input function over both functors values providing a resulting functor.
 *
 * The function can be called both as a unary liftA2(fn)(functor)(functor) and ternary liftA2(fn, functor, functor).
 *
 * @HindleyMilner liftA2 (a -> b -> c) -> Applicative a -> Applicative b -> Applicative c
 *
 * @pure
 * @param {function} fn
 * @param {functor} ap1
 * @param {functor} ap2
 * @return {functor}
 *
 * @example
 * import {liftA2, Maybe} from '@7urtle/lambda';
 *
 * const add = a => b => a + b;
 *
 * // function add which expects two inputs is applied to the values of two applicative functors Maybe
 * // the result is a Maybe functor with the internal value 5
 * liftA2(add)(Maybe.of(2))(Maybe.of(3)); // => Just(5)
 *
 * // an example of applying a function over a Maybe of undefined value to demonstrate continued safety of functors
 * liftA2(add)(Maybe.of(1))(Maybe.of(undefined)).isNothing(); // => true
 *
 * // liftA2 can be called both as a curried unary function or as a standard ternary function
 * liftA2(add)(Maybe.of(2))(Maybe.of(3)).value === liftA2(add, Maybe.of(2), Maybe.of(3)).value;
 */
export const liftA2 = nary(fn => ap1 => ap2 => ap1.map(fn).ap(ap2));

/**
 * liftA3 provides point-free way of writing calls over applicative functors and functions expecting 3 inputs. It
 * applies input function over input functors values providing a resulting functor.
 *
 * The function can be called both as a unary liftA3(fn)(functor)(functor)(functor) and quaternary liftA2(fn, functor, functor, functor).
 *
 * @HindleyMilner liftA3 (a -> b -> c -> d) -> Applicative a -> Applicative b -> Applicative c -> Applicative d
 *
 * @pure
 * @param {function} fn
 * @param {functor} ap1
 * @param {functor} ap2
 * @param {functor} ap3
 * @return {functor}
 *
 * @example
 * import {liftA3, Maybe} from '@7urtle/lambda';
 *
 * const add = a => b => c => a + b + c;
 *
 * // function add which expects three inputs is applied to the values of three applicative functors Maybe
 * // the result is a Maybe functor with the internal value 9
 * liftA3(add)(Maybe.of(2))(Maybe.of(3))(Maybe.of(4)); // => Just(9)
 *
 * // an example of applying a function over a Maybe of undefined value to demonstrate continued safety of functors
 * liftA3(add)(Maybe.of(1))(Maybe.of(2))(Maybe.of(undefined)).isNothing(); // => true
 *
 * // liftA3 can be called both as a curried unary function or as a standard quaternary function
 * liftA3(add)(Maybe.of(2))(Maybe.of(3))(Maybe.of(4)).value === liftA3(add, Maybe.of(2), Maybe.of(3), Maybe.of(4)).value;
 */
export const liftA3 = nary(fn => ap1 => ap2 => ap3 => ap1.map(fn).ap(ap2).ap(ap3));

/**
 * contact outputs concatenated inputs of strings, arrays and objects or outputs undefined for other types.
 *
 * concat can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner concat :: a -> a|boolean
 *
 * @pure
 * @param {*} a
 * @param {*} b
 * @return {*}
 *
 * @example
 * import {concat} from '@7urtle/lambda';
 *
 * concat('cd')('ab'); // => 'abcd'
 * concat([3, 4])([1,2]); // => [1, 2, 3, 4]
 * concat({here: {here: 'there'}})({hi: 'hello'}); // => {hi: 'hello', here: {here: 'there'}}
 * concat('cd')(1); // => undefined
 *
 * // concat can be called both as a curried unary function or as a standard binary function
 * concat('cd')('ab') === concat('cd', 'ab');
 */
export const concat = nary(a => b =>
  isString(b) || isArray(b)
    ? b.concat(a)
    : isObject(b)
      ? {...b, ...a}
      : undefined);

/**
 * includes(a)(b) output is true if b includes a.
 *
 * includes can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner includes :: a -> b -> boolean
 *
 * @pure
 * @param {*} a
 * @param {*} b
 * @return {*}
 *
 * @example
 * import {includes} from '@7urtle/lambda';
 *
 * includes('rt')('7urtle'); // => true
 * includes(1)([1, 2, 3]) // => true
 * includes('turtle')([1, 2, 3]) // => false
 *
 * // includes can be called both as a curried unary function or as a standard binary function
 * includes('rt')('7urtle') === includes('rt', '7urtle');
 */
export const includes = nary(a => b => b.includes(a));

/**
 * indexOf(a)(b) outputs position of input a within input b or undefined if it is not found.
 *
 * indexOf can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner indexOf :: a -> b -> number
 *
 * @pure
 * @param {*} a
 * @param {*} b
 * @return {*}
 *
 * @example
 * import {indexOf} from '@7urtle/lambda';
 *
 * indexOf('7')('7urtle'); // => 0
 * indexOf(7)('7urtle'); // => 0
 * indexOf(2)([1, 2, 3]); // => 1
 * indexOf(4)([1, 2, 3]); // => undefined
 *
 * // indexOf can be called both as a curried unary function or as a standard binary function
 * indexOf('7')('7urtle') === indexOf('7', '7urtle');
 */
export const indexOf = nary(a => b => minusOneToUndefined(b.indexOf(a)));

/**
 * lastIndexOf(a)(b) outputs position of input a withing input b looking from the end or it retuns undefined if it is not found.
 *
 * lastIndexOf can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner lastIndexOf :: a -> b -> number
 *
 * @pure
 * @param {*} a
 * @param {*} b
 * @return {*}
 *
 * @example
 * import {lastIndexOf} from '@7urtle/lambda';
 *
 * lastIndexOf('urtle')('7urtle'); // => 1
 * lastIndexOf(2)([1, 2, 3, 2]); // => 3
 * lastIndexOf('8')('7urtle'); // => undefined
 *
 * // lastIndexOf can be called both as a curried unary function or as a standard binary function
 * lastIndexOf('7')('7urtle') === lastIndexOf('7', '7urtle');
 */
export const lastIndexOf = nary(a => b => minusOneToUndefined(b.lastIndexOf(a)));

/**
 * memoize uses input memory to save output of input function and then uses it to lookup the result on a repeated run. This
 * function is not pure because the input memory is modified in the process.
 *
 * The function can be called both as a curried unary function or as a standard ternary function.
 *
 * @HindleyMilner memoize :: object -> (a -> b) -> a -> b
 *
 * @param {object} memory
 * @param {function} fn
 * @param {*} anything
 * @return {*}
 *
 * @example
 * import {memoize} from '@7urtle/lambda';
 *
 * const addTwo = a => a + 2;
 * let memory = {};
 *
 * memoize(memory)(addTwo)(1); // => 3
 * memoize(memory)(addTwo)(1); // => 3
 * memory[1]; // => 3
 *
 * // lastIndexOf can be called both as a curried unary function or as a standard ternary function
 * memoize(memory)(addTwo)(1) === memoize(memory, addTwo, 1);
 */
export const memoize = nary(memory => fn => anything =>
    anything in memory
        ? memory[anything]
        : passThrough(b => memory[anything] = b)(fn(anything))
);

/**
 * memo takes input function and returns it enhanced by memoization which ensures that each result is
 * always remembered internally and executed only once.
 *
 * @HindleyMilner memo :: (a -> b) -> (a -> b)
 *
 * @pure
 * @param {function} fn
 * @return {function}
 *
 * @example
 * import {memo} from '@7urtle/lambda';
 *
 * const addTwo = a => a + 2;
 * const memoAddTwo = memo(addTwo);
 * const memoAddThree = memo(a => a + 3);
 *
 * memoAddTwo(1); // => 3
 * memoAddThree(1); // => 4
 *
 * let count = 0;
 * const increaseCount = () => ++count;
 *
 * increaseCount(); // 1
 * increaseCount(); // 2
 *
 * const memoIncreaseCount = memo(increaseCount);
 *
 * memoIncreaseCount(); // 3
 * memoIncreaseCount(); // 3
 * memoIncreaseCount(); // 3
 */
export const memo = fn => memoize({})(fn);