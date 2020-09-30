import {isArray, isEqual, isString, isObject, isFunction, isNull, isUndefined, isGreaterThan} from "./conditional";
import {keysOf, join} from "./list";
import {map} from "./core";
import {nary} from "./arity";

/**
 * typeOf outputs a type of its input.
 *
 * @HindleyMilner typeOf :: a -> string
 *
 * @pure
 * @param {*} a
 * @return {string}
 *
 * @example
 * import {typeOf} from '@7urtle/lambda';
 *
 * typeOf('7turtle'); // => 'string'
 */
export const typeOf = a => typeof a;

/**
 * lengthOf outputs the length of an input.
 *
 * @HindleyMilner lengthOf :: (string|array) -> number
 *
 * @pure
 * @param {string|array} a
 * @return {number}
 *
 * @example
 * import {lengthOf} from '@7urtle/lambda';
 *
 * lengthOf('7turtle'); // => 7
 * lengthOf([1,2,3]); // => 3
 * lengthOf({}); // => undefined
 */
export const lengthOf = a => a.length;

/**
 * passThrough output is the same as input a. passThrough executes function passed as first argument.
 *
 * passThrough can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner passThrough :: function -> a -> a
 *
 * @pure
 * @param {function} fn
 * @param {*} anything
 * @return {boolean}
 *
 * @example
 * import {passThrough} from '@7urtle/lambda';
 *
 * passThrough(() => 'b')('a'); // => 'a'
 *
 * // isTypeOf can be called both as a curried unary function or as a standard binary function
 * passThrough(() => 'b')('a') === passThrough(() => 'b', 'a');
 */
export const passThrough = nary(fn => anything => {
  fn(anything);
  return anything;
});

/**
 * log output is the same as input and it logs the input value. log causes side effect of console.log.
 *
 * @HindleyMilner log :: a -> a
 *
 * @param {*} anything
 * @return {*}
 *
 * @example
 * import {log} from '@7urtle/lambda';
 *
 * log('anything'); // => 'anything'
 */
export const log = passThrough(console.log);

/**
 * spy output is the same as input and it logs the deepInspect of the input. spy causes side effect of console.log.
 *
 * @HindleyMilner spy :: a -> a
 *
 * @param {*} anything
 * @return {*}
 *
 * @example
 * import {spy} from '@7urtle/lambda';
 *
 * spy([1, 'a']); // => "[1, 'a']"
 */
export const spy = passThrough(a => console.log(deepInspect(a)));

/**
 * minusOneToUndefined output is the same as input or undefined if input is -1.
 *
 * Because some functions return -1 as error state, this function is created to change it into a more consistent
 * undefined output.
 *
 * @HindleyMilner minusOneToUndefined :: a -> a|boolean
 *
 * @pure
 * @param {*} anything
 * @return {*|boolean}
 *
 * @example
 * import {log} from '@7urtle/lambda';
 *
 * minusOneToUndefined(-1); // => undefined
 * minusOneToUndefined(0); // => 0
 * minusOneToUndefined('7urtle'); // => '7urtle'
 */
export const minusOneToUndefined = anything => isEqual(-1)(anything) ? undefined: anything;

/**
 * inspectFunction outputs name of named function or its conversion to string.
 *
 * @HindleyMilner inspectFunction :: (a -> b) -> string
 *
 * @pure
 * @param {function} fn
 * @return {string}
 *
 * @example
 * import {inspectFunction} from '@7urtle/lambda';
 *
 * function namedFunction() {
 *   return null;
 * }
 *
 * inspectFunction(namedFunction); // => 'namedFunction'
 * inspectFunction(() => 'b');
 * // => `function () {
 * // =>     return 'b';
 * // => }`
 */
export const inspectFunction = fn => fn.name ? fn.name : String(fn);

/**
 * inspectArray maps over input array [a] and outputs string representing it.
 *
 * @HindleyMilner inspectArray :: [a] -> string
 *
 * @pure
 * @param {array} a
 * @return {string}
 *
 * @example
 * import {inspectArray} from '@7urtle/lambda';
 *
 * function namedFunction() {
 *   return null;
 * }
 *
 * inspectArray([1, 'a']); // => "[1, 'a']"
 * inspectArray([namedFunction, 'a']); // => "[namedFunction, 'a']"
 */
export const inspectArray = a => `[${join(', ')(map(deepInspect)(a))}]`;

/**
 * inspectString outputs string representing input.
 *
 * @HindleyMilner inspectString :: a -> string
 *
 * @pure
 * @param {*} a
 * @return {string}
 *
 * @example
 * import {inspectString} from '@7urtle/lambda';
 *
 * inspectString('my string'); // => "'my string'"
 */
export const inspectString = a => `'${a}'`;

/**
 * inspectObject outputs string representing input.
 *
 * @HindleyMilner inspectObject :: a -> string
 *
 * @pure
 * @param {object} a
 * @return {string}
 *
 * @example
 * import {inspectObject} from '@7urtle/lambda';
 *
 * inspectObject({a: 'b'}); // => "{a: 'b'}"
 */
export const inspectObject = a =>
  isFunction(a.inspect)
    ? a.inspect()
    : `{${join(', ')(map(join(': '))(map(k => [k, deepInspect(a[k])])(keysOf(a))))}}`

/**
 * deepInspect runs recursively over input and outputs string representing the input.
 *
 * @HindleyMilner deepInspect :: a -> string
 *
 * @pure
 * @param {*} a
 * @return {string}
 *
 * @example
 * import {deepInspect} from '@7urtle/lambda';
 *
 * function namedFunction() {
 *   return null;
 * }
 *
 * deepInspect({a: 'b'}); // => "{a: 'b'}"
 * deepInspect(namedFunction); // => 'namedFunction'
 * deepInspect([1, 'a']); // => "[1, 'a']"
 * deepInspect('my string'); // => "'my string'"
 * deepInspect(undefined); // => 'undefined'
 */
export const deepInspect = a =>
  isUndefined(a)
    ? 'undefined'
    : isNull(a)
      ? 'null'
      : isFunction(a)
        ? inspectFunction(a)
        : isArray(a)
          ? inspectArray(a)
          : isObject(a)
            ? inspectObject(a)
            : isString(a)
              ? inspectString(a)
              : String(a);