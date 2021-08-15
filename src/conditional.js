import { typeOf, lengthOf, deepInspect } from "./utils";
import { everyOf, someOf } from './list';
import { nary } from "./arity";

/**
 * and is a boolean-type function composition
 * where each boolean function is '&&'d together.
 * 
 * The boolean functions may be entered in any order.
 * 
 * and can be used together with or to encapsulate a predicate in a single function.
 * 
 * @HindleyMilner and :: [(a -> boolean)] -> a -> boolean
 * 
 * @pure
 * @param {function} predicates
 * @param {*} anything
 * @return {*}
 * 
 * @example
 * import {and, isGreaterThan, isLessThan} from '@7urtle/lambda';
 * 
 * const isEven = number => number % 2 === 0;
 * 
 * const isSingleEvenDigit = and(isEven, isGreaterThan(-10), isLessThan(10));
 * isSingleEvenDigit(8)
 * // => true
 */
 export const and = (...predicates) => anything => everyOf(predicate => predicate(anything))(predicates);

 /**
  * or is a boolean-type function composition
  * where each boolean function is '||'d together.
  * 
  * The boolean functions may be entered in any order.
  * 
  * or can be used together with and to encapsulate a predicate in a single function.
  * 
  * @HindleyMilner or :: [(a -> boolean)] -> a -> boolean
  * 
  * @pure
  * @param {function} predicates
  * @param {*} anything
  * @return {*}
  * 
  * @example
  * import {or} from '@7urtle/lambda';
  * 
  * const isDivisibleBy = divisor => number => number % divisor === 0;
  * const isFizzBuzzNumber = or(isDivisibleBy(3), isDivisibleBy(5));
  * 
  * isFizzBuzzNumber(15)
  * // => true
  */
 export const or = (...predicates) => anything => someOf(predicate => predicate(anything))(predicates);

/**
 * isEqual output is true if strict equality between a and b is true. isEqual output is always false for comparison
 * of objects and arrays.
 *
 * isEqual can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner isEqual :: a -> b -> boolean
 *
 * @pure
 * @param {*} a
 * @param {*} b
 * @return {boolean}
 *
 * @example
 * import {isEqual} from '@7urtle/lambda';
 *
 * isEqual('something')('something'); // => true
 * isEqual('something')('something else'); // => false
 * isEqual(['a'])(['a']); // => false
 * isEqual({a : 'something'})({a : 'something'}); // => false
 * isEqual([])([]); // => false
 * isEqual([])([]); // => false
 *
 * // isEqual can be called both as a curried unary function or as a standard binary function
 * isEqual('something')('something') === isEqual('something', 'something');
 */
export const isEqual = nary(a => b => a === b);

/**
 * isNotEqual output is true if strict equality between a and b is false. isNotEqual output is always true for
 * comparison of objects and arrays.
 *
 * isEqual can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner isNotEqual :: a -> b -> boolean
 *
 * @pure
 * @param {*} a
 * @param {*} b
 * @return {boolean}
 *
 * @example
 * import {isNotEqual} from '@7urtle/lambda';
 *
 * isNotEqual('something')('something'); // => false
 * isNotEqual('something')('something else'); // => true
 * isNotEqual(['a'])(['a']); // => true
 * isNotEqual({a : 'something'})({a : 'something'}); // => true
 * isNotEqual([])([]); // => true
 * isNotEqual([])([]); // => true
 *
 * // isNotEqual can be called both as a curried unary function or as a standard binary function
 * isNotEqual('something')('something else') === isNotEqual('something', 'something else');
 */
export const isNotEqual = nary(a => b => a !== b);

/**
 * isDeepEqual output is true if strict equality between the string conversion of a and the string conversion of b
 * is true including arrays and objects.
 *
 * isDeepEqual can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner isDeepEqual :: a -> b -> boolean
 *
 * @pure
 * @param {*} a
 * @param {*} b
 * @return {boolean}
 *
 * @example
 * import {isDeepEqual} from '@7urtle/lambda';
 *
 * isDeepEqual('something')('something'); // => true
 * isDeepEqual('something')('something else'); // => false
 * isDeepEqual(['a'])(['a']); // => true
 * isDeepEqual({a : 'something'})({a : 'something'}); // => true
 * isDeepEqual([])([]); // => true
 * isDeepEqual([])([]); // => true
 *
 * // isDeepEqual can be called both as a curried unary function or as a standard binary function
 * isDeepEqual('something')('something') === isDeepEqual('something', 'something');
 */
export const isDeepEqual = nary(a => b => isEqual(deepInspect(a))(deepInspect(b)));

/**
 * isNotDeepEqual output is true if strict equality between the string conversion of a and the string conversion of b
 * is false including arrays and objects.
 *
 * isNotDeepEqual can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner isNotDeepEqual :: a -> b -> boolean
 *
 * @pure
 * @param {*} a
 * @param {*} b
 * @return {boolean}
 *
 * @example
 * import {isNotDeepEqual} from '@7urtle/lambda';
 *
 * isNotDeepEqual('something')('something'); // => false
 * isNotDeepEqual('something')('something else'); // => true
 * isNotDeepEqual(['a', 'b'])(['a']); // => true
 * isNotDeepEqual({a : 'something', b: c => c})({a : 'something'}); // => true
 * isNotDeepEqual([])([]); // => false
 * isNotDeepEqual([])([]); // => false
 *
 * // isNotDeepEqual can be called both as a curried unary function or as a standard binary function
 * isNotDeepEqual('something')('something else') === isNotDeepEqual('something', 'something else');
 */
export const isNotDeepEqual = nary(a => b => isNotEqual(deepInspect(a))(deepInspect(b)));

/**
 * isTrue output is true if input is true.
 *
 * @HindleyMilner isTrue :: a -> boolean
 *
 * @pure
 * @param {*} anything
 * @return {boolean}
 *
 * @example
 * import {isTrue} from '@7urtle/lambda';
 *
 * isTrue(true); // => true
 * isTrue(false); // => false
 */
export const isTrue = isEqual(true);

/**
 * isFalse output is true if input is false.
 *
 * @HindleyMilner isFalse :: a -> Boolean
 *
 * @pure
 * @param {*} anything
 * @return {boolean}
 *
 * @example
 * import {isFalse} from '@7urtle/lambda';
 *
 * isFalse(true); // => false
 * isFalse(false); // => true
 */
export const isFalse = isEqual(false);

/**
 * isGreaterThan output is true if b is greater than a.
 *
 * isGreaterThan can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner isGreaterThan :: a -> b -> boolean
 *
 * @pure
 * @param {number} a
 * @param {number} b
 * @return {boolean}
 *
 * @example
 * import {isGreaterThan} from '@7urtle/lambda';
 *
 * isGreaterThan(1)(2); // => true
 * isGreaterThan(3)(2); // => false
 *
 * // isGreaterThan can be called both as a curried unary function or as a standard binary function
 * isGreaterThan(1)(2) === isGreaterThan(1, 2);
 */
export const isGreaterThan = nary(a => b => b > a);

/**
 * isLessThan output is true if b is less than a.
 *
 * isLessThan can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner isLessThan :: a -> b -> boolean
 *
 * @pure
 * @param {number} a
 * @param {number} b
 * @return {boolean}
 *
 * @example
 * import {isLessThan} from '@7urtle/lambda';
 *
 * isLessThan(1)(2); // => false
 * isLessThan(3)(2); // => true
 *
 * // isLessThan can be called both as a curried unary function or as a standard binary function
 * isLessThan(3)(2) === isLessThan(3, 2);
 */
export const isLessThan = nary(a => b => b < a);

/**
 * isAtLeast output is true if b is greater or equal to a.
 *
 * isAtLeast can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner isAtLeast :: a -> b -> boolean
 *
 * @pure
 * @param {number} a
 * @param {number} b
 * @return {boolean}
 *
 * @example
 * import {isAtLeast} from '@7urtle/lambda';
 *
 * isAtLeast(1)(2); // => true
 * isAtLeast(2)(2); // => true
 * isAtLeast(3)(2); // => false
 *
 * // isAtLeast can be called both as a curried unary function or as a standard binary function
 * isAtLeast(1)(2) === isAtLeast(1, 2);
 */
export const isAtLeast = nary(a => b => b >= a);

/**
 * isAtMost output is true if b is less or equal to a.
 *
 * isAtMost can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner isAtMost :: a -> b -> boolean
 *
 * @pure
 * @param {number} a
 * @param {number} b
 * @return {boolean}
 *
 * @example
 * import {isAtMost} from '@7urtle/lambda';
 *
 * isAtMost(1)(2); // => false
 * isAtMost(2)(2); // => true
 * isAtMost(3)(2); // => true
 *
 * // isAtLeast can be called both as a curried unary function or as a standard binary function
 * isAtMost(3)(2) === isAtMost(31, 2);
 */
export const isAtMost = nary(a => b => b <= a);

/**
 * isBetween output is true if c is between a and b.
 *
 * isBetween can be called both as a curried unary function or as a standard ternary function.
 *
 * @HindleyMilner isBetween :: a -> b -> c -> boolean
 *
 * @pure
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {boolean}
 *
 * @example
 * import {isBetween} from '@7urtle/lambda';
 *
 * isBetween(1)(3)(2); // => true
 * isBetween(3)(1)(2); // => true
 * isBetween(1)(3)(3); // => false
 * isBetween(1)(3)(4); // => false
 *
 * // isBetween can be called both as a curried unary function or as a standard ternary function
 * isBetween(1)(3)(2) === isBetween(1, 3, 2);
 */
export const isBetween = nary(a => b => c =>
    a > b
    ? a > c && b < c
    : a < c && b > c
);

/**
 * isInRange output is true if c is in range of a and b.
 *
 * isInRange can be called both as a curried unary function or as a standard ternary function.
 *
 * @HindleyMilner isInRange :: a -> b -> c -> boolean
 *
 * @pure
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {boolean}
 *
 * @example
 * import {isInRange} from '@7urtle/lambda';
 *
 * isInRange(1)(3)(2); // => true
 * isInRange(3)(1)(2); // => true
 * isInRange(1)(3)(3); // => true
 * isInRange(1)(3)(4); // => false
 *
 * // isInRange can be called both as a curried unary function or as a standard ternary function
 * isInRange(1)(3)(2) === isInRange(1, 3, 2);
 */
 export const isInRange = nary(a => b => c =>
    a > b
    ? a >= c && b <= c
    : a <= c && b >= c
);

/**
 * isTypeOf output is true if b is a type of a.
 *
 * isTypeOf can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner isTypeOf :: a -> b -> boolean
 *
 * @pure
 * @param {*} a
 * @param {*} b
 * @return {boolean}
 *
 * @example
 * import {isTypeOf} from '@7urtle/lambda';
 *
 * isTypeOf('number')(1); // => true
 * isTypeOf('string')(1); // => false
 *
 * // isTypeOf can be called both as a curried unary function or as a standard binary function
 * isTypeOf('number')(1) === isTypeOf('number', 1);
 */
export const isTypeOf = nary(a => b => isEqual(typeOf(b))(a));

/**
 * isNotTypeOf output is true if b is not a type of a.
 *
 * isNotTypeOf can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner isNotTypeOf :: a -> b -> boolean
 *
 * @pure
 * @param {*} a
 * @param {*} b
 * @return {boolean}
 *
 * @example
 * import {isNotTypeOf} from '@7urtle/lambda';
 *
 * isNotTypeOf('number')(1); // => false
 * isNotTypeOf('string')(1); // => true
 *
 * // isNotTypeOf can be called both as a curried unary function or as a standard binary function
 * isNotTypeOf('string')(1) === isNotTypeOf('string', 1);
 */
export const isNotTypeOf = nary(a => b => isNotEqual(typeOf(b))(a));

/**
 * isString output is true if input is a string.
 *
 * @HindleyMilner isString :: a -> boolean
 *
 * @pure
 * @param {*} a
 * @return {boolean}
 *
 * @example
 * import {isString} from '@7urtle/lambda';
 *
 * isString('string'); // => true
 * isString(1); // => false
 */
export const isString = isTypeOf('string');

/**
 * isNotString output is true if input is not a string.
 *
 * @HindleyMilner isNotString :: a -> boolean
 *
 * @pure
 * @param {*} a
 * @return {boolean}
 *
 * @example
 * import {isNotString} from '@7urtle/lambda';
 *
 * isNotString('string'); // => false
 * isNotString(1); // => true
 */
export const isNotString = isNotTypeOf('string');

/**
 * isBoolean output is true if input is a boolean.
 *
 * @HindleyMilner isBoolean :: a -> boolean
 *
 * @pure
 * @param {*} a
 * @return {boolean}
 *
 * @example
 * import {isBoolean} from '@7urtle/lambda';
 *
 * isBoolean(false); // => true
 * isBoolean(1); // => false
 */
export const isBoolean = isTypeOf('boolean');

/**
 * isNotBoolean output is true if input is not a boolean.
 *
 * @HindleyMilner isNotBoolean :: a -> boolean
 *
 * @pure
 * @param {*} a
 * @return {boolean}
 *
 * @example
 * import {isNotBoolean} from '@7urtle/lambda';
 *
 * isNotBoolean(false); // => false
 * isNotBoolean(1); // => true
 */
export const isNotBoolean = isNotTypeOf('boolean');

/**
 * isNull output is true if input is a null.
 *
 * @HindleyMilner isNull :: a -> boolean
 *
 * @pure
 * @param {*} a
 * @return {boolean}
 *
 * @example
 * import {isNull} from '@7urtle/lambda';
 *
 * isNull(null); // => true
 * isNull(1); // => false
 */
export const isNull = isEqual(null);

/**
 * isNotNull output is true if input is not a null.
 *
 * @HindleyMilner isNotNull :: a -> boolean
 *
 * @pure
 * @param {*} a
 * @return {boolean}
 *
 * @example
 * import {isNotNull} from '@7urtle/lambda';
 *
 * isNotNull(null); // => false
 * isNotNull(1); // => true
 */
export const isNotNull = isNotEqual(null);

/**
 * isUndefined output is true if input is an undefined.
 *
 * @HindleyMilner isUndefined :: a -> boolean
 *
 * @pure
 * @param {*} a
 * @return {boolean}
 *
 * @example
 * import {isUndefined} from '@7urtle/lambda';
 *
 * isUndefined(undefined); // => true
 * isUndefined(1); // => false
 */
export const isUndefined = isTypeOf('undefined');

/**
 * isNotUndefined output is true if input is not an undefined.
 *
 * @HindleyMilner isNotUndefined :: a -> boolean
 *
 * @pure
 * @param {*} a
 * @return {boolean}
 *
 * @example
 * import {isNotUndefined} from '@7urtle/lambda';
 *
 * isNotUndefined(undefined); // => false
 * isNotUndefined(1); // => true
 */
export const isNotUndefined = isNotTypeOf('undefined');

/**
 * isNumber output is true if input is a number.
 *
 * @HindleyMilner isNumber :: a -> boolean
 *
 * @pure
 * @param {*} a
 * @return {boolean}
 *
 * @example
 * import {isNumber} from '@7urtle/lambda';
 *
 * isNumber(1); // => true
 * isNumber('string'); // => false
 */
export const isNumber = isTypeOf('number');

/**
 * isNotNumber output is true if input is not a number.
 *
 * @HindleyMilner isNotNumber :: a -> boolean
 *
 * @pure
 * @param {*} a
 * @return {boolean}
 *
 * @example
 * import {isNotNumber} from '@7urtle/lambda';
 *
 * isNotNumber(1); // => false
 * isNotNumber('string'); // => true
 */
export const isNotNumber = isNotTypeOf('number');

/**
 * isObject output is true if b is an object, array, or null.
 *
 * @HindleyMilner isObject :: a -> boolean
 *
 * @pure
 * @param {*} a
 * @return {boolean}
 *
 * @example
 * import {isObject} from '@7urtle/lambda';
 *
 * isObject({}); // => true
 * isObject([]); // => true
 * isObject(null); // => true
 * isObject(1); // => false
 */
export const isObject = isTypeOf('object');

/**
 * isNotObject output is true if input is not an object, array, or null.
 *
 * @HindleyMilner isNotObject :: a -> boolean
 *
 * @pure
 * @param {*} a
 * @return {boolean}
 *
 * @example
 * import {isNotObject} from '@7urtle/lambda';
 *
 * isNotObject({}); // => false
 * isNotObject([]); // => false
 * isNotObject(null); // => false
 * isNotObject(1); // => true
 */
export const isNotObject = isNotTypeOf('object');

/**
 * isArray output is true if input is an array.
 *
 * @HindleyMilner isArray :: a -> boolean
 *
 * @pure
 * @param {*} a
 * @return {boolean}
 *
 * @example
 * import {isArray} from '@7urtle/lambda';
 *
 * isArray([]); // => true
 * isArray({}); // => false
 */
export const isArray = Array.isArray;

/**
 * isNotArray output is true if input is not an array.
 *
 * @HindleyMilner isNotArray :: a -> boolean
 *
 * @pure
 * @param {*} a
 * @return {boolean}
 *
 * @example
 * import {isNotArray} from '@7urtle/lambda';
 *
 * isNotArray([]); // => false
 * isNotArray({}); // => true
 */
export const isNotArray = a => !Array.isArray(a);

/**
 * isFunction output is true if input is a function.
 *
 * @HindleyMilner isFunction :: a -> boolean
 *
 * @pure
 * @param {*} a
 * @return {boolean}
 *
 * @example
 * import {isFunction} from '@7urtle/lambda';
 *
 * isFunction(() => null); // => true
 * isFunction(1); // => false
 */
export const isFunction = isTypeOf('function');

/**
 * isNotFunction output is true if input is not a function.
 *
 * @HindleyMilner isNotFunction :: a -> boolean
 *
 * @pure
 * @param {*} a
 * @return {boolean}
 *
 * @example
 * import {isNotFunction} from '@7urtle/lambda';
 *
 * isNotFunction(() => null); // => false
 * isNotFunction(1); // => true
 */
export const isNotFunction = isNotTypeOf('function');

/**
 * isLength output is true if b is a length of a.
 *
 * @HindleyMilner isLength :: (string|array) -> b -> boolean
 *
 * @pure
 * @param {string|array} a
 * @param {number} b
 * @return {boolean}
 *
 * @example
 * import {isLength} from '@7urtle/lambda';
 *
 * isLength(3)('abc'); // => true
 * isLength(3)([1,2,3]); // => true
 * isLength(3)('abc'); // => false
 */
export const isLength = nary(a => b => isEqual(lengthOf(b))(a));

/**
 * isNotLength output is true if b is not a length of a.
 * 
 * The function can be called both as a unary isNotLength(a)(b) and binary isNotLength(a, b).
 *
 * @HindleyMilner isNotLength :: (string|array) -> b -> boolean
 *
 * @pure
 * @param {string|array} a
 * @param {number} b
 * @return {boolean}
 *
 * @example
 * import {isNotLength} from '@7urtle/lambda';
 *
 * isNotLength(3)('abc'); // => false
 * isNotLength(3)([1,2,3]); // => false
 * isNotLength(3)('abce'); // => true
 * 
 * isNotLength(3)('abcd') === isNotLength(3, 'abcd'); // => true
 */
export const isNotLength = nary(a => b => !isLength(a)(b));

/**
 * isEmpty output is true if input is an empty string, array, or object. Otherwise it is false.
 *
 * @HindleyMilner isEmpty :: (string|array) -> boolean
 *
 * @pure
 * @param {string|array|object} anything
 * @return {boolean}
 *
 * @example
 * import {isEmpty} from '@7urtle/lambda';
 *
 * isEmpty(''); // => true
 * isEmpty([]); // => true
 * isEmpty({}); // => true
 * isEmpty('abc'); // => false
 */
export const isEmpty = anything =>
    isLength(0)(anything) ||
    (isObject(anything) ? isLength(0)(Object.getOwnPropertyNames(anything)) : false);

/**
 * isNotEmpty output is false if input is an empty string, array, or object. Otherwise it is true.
 *
 * @HindleyMilner isNotEmpty :: (string|array) -> boolean
 *
 * @pure
 * @param {string|array|object} anything
 * @return {boolean}
 *
 * @example
 * import {isNotEmpty} from '@7urtle/lambda';
 *
 * isNotEmpty(''); // => false
 * isNotEmpty([]); // => false
 * isNotEmpty('abc'); // => true
 * isNotEmpty({}); => true
 */
export const isNotEmpty = anything => !isEmpty(anything);

/**
 * isZero output is true if input is 0.
 *
 * @HindleyMilner isZero :: a -> boolean
 *
 * @pure
 * @param {number} a
 * @return {boolean}
 *
 * @example
 * import {isZero} from '@7urtle/lambda';
 *
 * isZero(0); // => true
 * isZero(1); // => false
 */
export const isZero = isEqual(0);

/**
 * isNotZero output is true if input is not 0.
 *
 * @HindleyMilner isNotZero :: a -> boolean
 *
 * @pure
 * @param {number} a
 * @return {boolean}
 *
 * @example
 * import {isZero} from '@7urtle/lambda';
 *
 * isZero(0); // => false
 * isZero(1); // => true
 */
export const isNotZero = isNotEqual(0);

/**
 * isNothing returns true if input is null, undefined or empty string or empty array or empty object.
 *
 * @HindleyMilner isNothing :: a -> boolean
 *
 * @pure
 * @param {*} anything
 * @return {boolean}
 *
 * @example
 * import {isNothing} from '@7urtle/lambda';
 *
 * isNothing(null); // => true
 * isNothing(undefined); // => true
 * isNothing(''); // => true
 * isNothing([]); // => true
 * isNothing({}); // => true
 * isNothing('7urtle'); // => false
 */
export const isNothing = anything => isNull(anything) || isUndefined(anything) || isEmpty(anything);

/**
 * isJust returns true if input is not null, undefined or empty string or empty array or empty object.
 *
 * @HindleyMilner isJust :: a -> boolean
 *
 * @pure
 * @param {*} anything
 * @return {boolean}
 *
 * @example
 * import {isJust} from '@7urtle/lambda';
 *
 * isJust(null); // => false
 * isJust(undefined); // => false
 * isJust(''); // => false
 * isJust([]); // => false
 * isJus({}); // => false
 * isJust('7urtle'); // => true
 */
export const isJust = anything => !isNothing(anything);

/**
 * when tests anything argument by passing it to predicate function. If the predicate function is true, when
 * will return the result of whenTrueFn function which receivs the same anything argument. If the predicate
 * is false, then the anything argument is returned unchanged.
 * 
 * The function can be called both as a unary when(predicate)(whenTrueFn)(anything) and ternary when(predicate, whenTrueFn, anything).
 *
 * @HindleyMilner when :: (a -> Boolean) -> (a -> a) -> a -> a
 *
 * @pure
 * @param {function} predicate
 * @param {function} whenTrueFn
 * @param {*} anything
 * @return {*}
 *
 * @example
 * import {when} from '@7urtle/lambda';
 *
 * const predicate = a => a > 1;
 * const whenTrueFn = a => a * 2;
 * 
 * when(predicate)(whenTrueFn)(2); // => 4
 * when(predicate)(whenTrueFn)(1); // => 1
 * 
 * when(predicate)(whenTrueFn)(2) === when(predicate, whenTrueFn, 2); // => true
 */
export const when = nary(predicate => whenTrueFn => anything =>
    predicate(anything)
    ? whenTrueFn(anything)
    : anything
);