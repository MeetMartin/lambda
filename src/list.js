import {minusOneToUndefined} from './utils';
import {nary} from "./arity";
import {upperCaseOf} from "./string";

/**
 * reduce executes input reducer function that over each member of input array [b] to output a single value. It is
 * the preferred way of working functionally with arrays as it is a pure function that does not cause mutations.
 *
 * reduce executes functions in reverse order to reduceRight.
 *
 * reduce can be called both as a curried unary function or as a standard ternary function.
 *
 * @HindleyMilner reduce :: a -> ((a, b) -> a) -> [b] -> a
 *
 * @pure
 * @param {*} initial
 * @param {function} reducer
 * @param {array} list
 * @return {*}
 *
 * @example
 * import {reduce} from '@7urtle/lambda';
 *
 * const reducer = (accumulator, currentValue) => accumulator + currentValue;
 * const list = ['a', 'b', 'c'];
 *
 * reduce('start')(reducer)(list); // => startabc
 *
 * // reduce can be called both as a curried unary function or as a standard ternary function
 * reduce('start')(reducer)(list) === reduce('start', reducer, list);
 */
export const reduce = nary(initial => reducer => list => list.reduce(reducer, initial));

/**
 * reduceRight executes input reducer function that over each member of input array [b] to output a single value. It is
 * the preferred way of working functionally with arrays as it is a pure function that does not cause mutations.
 *
 * reduceRight executes functions in reverse order to reduce.
 *
 * reduceRight can be called both as a curried unary function or as a standard ternary function.
 *
 * @HindleyMilner reduceRight :: a -> ((a, b) -> a) -> [b] -> a
 *
 * @pure
 * @param {*} initial
 * @param {function} reducer
 * @param {array} list
 * @return {*}
 *
 * @example
 * import {reduceRight} from '@7urtle/lambda';
 *
 * const reducer = (accumulator, currentValue) => accumulator + currentValue;
 * const list = ['a', 'b', 'c'];
 *
 * reduceRight('start')(reducer)(list); // => startcba
 *
 * // reduceRight can be called both as a curried unary function or as a standard ternary function
 * reduceRight('start')(reducer)(list) === reduceRight('start', reducer, list);
 */
export const reduceRight = nary(initial => reducer => list => list.reduceRight(reducer, initial));

/**
 * filter executes input checker over each member of input array [a] to filter and output filtered new array [b].
 *
 * filter can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner filter :: (a -> boolean) -> [a] -> [b]
 *
 * @pure
 * @param {function} checker
 * @param {array} list
 * @return {*}
 *
 * @example
 * import {filter} from '@7urtle/lambda';
 *
 * const list = [0, 1, 2, 3]
 *
 * filter(a => a > 1)(list); // => [2, 3]
 *
 * // filter can be called both as a curried unary function or as a standard binary function
 * filter(a => a > 1)(list) === filter(a => a > 1, list);
 */
export const filter = nary(checker => list => list.filter(checker));

/**
 * find executes input checker over each member of input array [a] and outputs the first array member that matches checker or undefined.
 *
 * find can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner find :: (a -> boolean) -> [a] -> [b]
 *
 * @pure
 * @param {function} checker
 * @param {array} list
 * @return {*}
 *
 * @example
 * import {find} from '@7urtle/lambda';
 *
 * const list = [0, 1, 2, 3]
 *
 * find(a => a > 1)(list); // => 2
 * find(a => a > 3)(list); // => undefined
 *
 * // find can be called both as a curried unary function or as a standard binary function
 * find(a => a > 1)(list) === find(a => a > 1, list);
 */
export const find = nary(checker => list => list.find(checker));

/**
 * findIndex executes input checker over each member of input array [a] and outputs the index of first array member that matches checker or undefined.
 *
 * findIndex can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner findIndex :: (a -> boolean) -> [a] -> [b]
 *
 * @pure
 * @param {function} checker
 * @param {array} list
 * @return {*}
 *
 * @example
 * import {findIndex} from '@7urtle/lambda';
 *
 * const list = [2, 3, 4];
 *
 * findIndex(a => a > 2)(list); // => 1
 * findIndex(a => a > 4)(list); // => undefined
 *
 * // findIndex can be called both as a curried unary function or as a standard binary function
 * findIndex(a => a > 1)(list) === findIndex(a => a > 1, list);
 */
export const findIndex = nary(checker => list => minusOneToUndefined(list.findIndex(checker)));

/**
 * join outputs a string created by joining input array members with input separator.
 *
 * join can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner join :: string -> [a] -> string
 *
 * @pure
 * @param {string} separator
 * @param {array} list
 * @return {*}
 *
 * @example
 * import {join} from '@7urtle/lambda';
 *
 * const list = [2, 3, 4];
 *
 * join('')(list); // => '234'
 * join(' and ')(list); // => '2 and 3 and 4'
 * join()(list); // => '2,3,4'
 *
 * // join can be called both as a curried unary function or as a standard binary function
 * join('')(list) === join('', list);
 */
export const join = nary(separator => list => list.join(separator));

/**
 * keysOf outputs array of string keys of input array or object.
 *
 * @HindleyMilner keysOf :: object -> [string]
 *
 * @pure
 * @param {Object|array} list
 * @return {array}
 *
 * @example
 * import {keysOf} from '@7urtle/lambda';
 *
 * keysOf([2, 3, 4]); // => ['0', '1', '2']
 * keysOf({1: 2, 2: 3}); // => ['1', '2']
 */
export const keysOf = Object.keys;

/**
 * entriesOf outputs array of arrays of string keys and raw values of input array or object.
 *
 * @HindleyMilner entriesOf :: object -> [[string, a]]
 *
 * @pure
 * @param {Object|array} list
 * @return {array}
 *
 * @example
 * import {entriesOf} from '@7urtle/lambda';
 *
 * entriesOf([2, 3, 4]); // => [['0', 2], ['1', 3], ['2', 4]]
 * entriesOf({1: 2, 2: 3}); // => [['1', 2],['2', 3]]
 */
export const entriesOf = Object.entries;

/**
 * everyOf outputs true if every element of input array passes input checker function as true.
 *
 * everyOf can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner everyOf :: (a -> boolean) -> [a] -> boolean
 *
 * @pure
 * @param {function} checker
 * @param {array} list
 * @return {boolean}
 *
 * @example
 * import {everyOf} from '@7urtle/lambda';
 *
 * everyOf(a => a > 1)([2, 3, 4]); // => true
 * everyOf(a => a > 5)([2, 3, 4]); // => false
 *
 * // everyOf can be called both as a curried unary function or as a standard binary function
 * everyOf(a => a > 1)([2, 3, 4]) === everyOf(a => a > 1, [2, 3, 4]);
 */
export const everyOf = nary(checker => list => list.every(checker));

/**
 * slice outputs selected array elements as an array based on input range.
 *
 * slice can be called both as a curried unary function or as a standard ternary function.
 *
 * @HindleyMilner slice :: number -> number -> [a] -> [a]
 *
 * @pure
 * @param {function} checker
 * @param {array} list
 * @return {array}
 *
 * @example
 * import {slice} from '@7urtle/lambda';
 *
 * slice(2)(1)([1, 2, 3, 4, 5]); // => [2]
 * slice(2)(0)([1, 2, 3, 4, 5]); // => [1, 2]
 * slice(8)(7)([1, 2, 3, 4, 5]); // => []
 *
 * // slice can be called both as a curried unary function or as a standard ternary function
 * slice(2)(1)([1, 2, 3, 4, 5]) === slice(2, 1, [1, 2, 3, 4, 5]);
 */
export const slice = nary(end => start => list => list.slice(start, end));

/**
 * some outputs true if any element of input array passes input checker function as true.
 *
 * some can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner some :: (a -> boolean) -> [a] -> boolean
 *
 * @pure
 * @param {function} checker
 * @param {array} list
 * @return {boolean}
 *
 * @example
 * import {some} from '@7urtle/lambda';
 *
 * someOf(a => a > 1)([2, 3, 4]); // => true
 * someOf(a => a > 5)([2, 3, 4]); // => false
 *
 * // some can be called both as a curried unary function or as a standard binary function
 * someOf(a => a > 1)([2, 3, 4]) === someOf(a => a > 1, [2, 3, 4]);
 */
export const someOf = nary(checker => list => list.some(checker));

/**
 * sort outputs an array sorted based on input compare function.
 *
 * sort can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner sort :: (a -> number) -> [a] -> [a]
 *
 * @pure
 * @param {function} compare
 * @param {array} list
 * @return {array}
 *
 * @example
 * import {sort} from '@7urtle/lambda';
 *
 * sort((a, b) => a < b ? -1 : a > b ? 1 : 0)(['a', 'd', 'c', 'd']); // => ['a', 'c', 'd', 'd']
 * sort((a, b) => a - b)([5, 3, 6]); // => [3, 5, 6]
 *
 * // some can be called both as a curried unary function or as a standard binary function
 * sort((a, b) => a - b)([5, 3, 6]) === sort((a, b) => a - b, [5, 3, 6]);
 */
export const sort = nary(compare => list => [...list].sort(compare));

/**
 * sortAlphabetically outputs an array sorted alphabetically from a to z.
 *
 * @HindleyMilner sortAlphabetically :: [string] -> [string]
 *
 * @pure
 * @param {array} list
 * @return {array}
 *
 * @example
 * import {sortAlphabetically} from '@7urtle/lambda';
 *
 * sortAlphabetically(['petra', 'Martin', 'Petra']); // => ['Martin', 'petra', 'Petra']
 */
export const sortAlphabetically = sort((a, b) => (a => b => a < b ? -1 : a > b ? 1 : 0)(upperCaseOf(a))(upperCaseOf(b)));

/**
 * sortAlphabeticallyZA outputs an array sorted alphabetically from z to a.
 *
 * @HindleyMilner sortAlphabeticallyZA :: [string] -> [string]
 *
 * @pure
 * @param {array} list
 * @return {array}
 *
 * @example
 * import {sortAlphabeticallyZA} from '@7urtle/lambda';
 *
 * sortAlphabeticallyZA(['petra', 'Martin', 'Petra']); // => ['petra', 'Petra', 'Martin']
 */
export const sortAlphabeticallyZA = sort((a, b) => (a => b => a < b ? 1 : a > b ? -1 : 0)(upperCaseOf(a))(upperCaseOf(b)));

/**
 * sortNumerically outputs an array sorted numerically from 1 to 2.
 *
 * @HindleyMilner sortNumerically :: [number] -> [number]
 *
 * @pure
 * @param {array} list
 * @return {array}
 *
 * @example
 * import {sortNumerically} from '@7urtle/lambda';
 *
 * sortNumerically([3, 4, 1, 3]); // => [1, 3, 3, 4]
 */
export const sortNumerically = sort((a, b) => a - b);

/**
 * sortNumerically21 outputs an array sorted numerically from 2 to 1.
 *
 * @HindleyMilner sortNumerically21 :: [number] -> [number]
 *
 * @pure
 * @param {array} list
 * @return {array}
 *
 * @example
 * import {sortNumerically21} from '@7urtle/lambda';
 *
 * sortNumerically21([3, 4, 1, 3]); // => [4, 3, 3, 1]
 */
export const sortNumerically21 = sort((a, b) => b - a);