import {typeOf, lengthOf, deepInspect} from "./utils";
import {nary} from "./arity";

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
 * isNotLength(3)('abc'); // => true
 */
export const isNotLength = nary(a => b => !isLength(a)(b));

/**
 * isEmpty output is true if input has a length of 0. isEmpty output is always false if input is an object and not
 * an array or a string.
 *
 * @HindleyMilner isEmpty :: (string|array) -> boolean
 *
 * @pure
 * @param {string|array} a
 * @return {boolean}
 *
 * @example
 * import {isEmpty} from '@7urtle/lambda';
 *
 * isEmpty(''); // => true
 * isEmpty([]); // => true
 * isEmpty('abc'); // => false
 * isEmpty({}); // => false
 */
export const isEmpty = isLength(0);

/**
 * isNotEmpty output is true if input does not have a length of 0. isNotEmpty output is always true if input is
 * an object and not an array or a string.
 *
 * @HindleyMilner isNotEmpty :: (string|array) -> boolean
 *
 * @pure
 * @param {string|array} a
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
export const isNotEmpty = isNotLength(0);

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
 * isNothing returns true if input is null, undefined or empty string or empty array.
 *
 * @HindleyMilner isNothing :: a -> boolean
 *
 * @pure
 * @param {number} a
 * @return {boolean}
 *
 * @example
 * import {isNothing} from '@7urtle/lambda';
 *
 * isNothing(null); // => true
 * isNothing(undefined); // => true
 * isNothing(''); // => true
 * isNothing([]); // => true
 * isNothing('7urtle'); // => false
 */
export const isNothing = a => isNull(a) || isUndefined(a) || isEmpty(a);

/**
 * isJust returns true if input is not null, undefined or empty string or empty array.
 *
 * @HindleyMilner isJust :: a -> boolean
 *
 * @pure
 * @param {number} a
 * @return {boolean}
 *
 * @example
 * import {isJust} from '@7urtle/lambda';
 *
 * isJust(null); // => false
 * isJust(undefined); // => false
 * isJust(''); // => false
 * isJust([]); // => false
 * isJust('7urtle'); // => true
 */
export const isJust = a => !isNothing(a);