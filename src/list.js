import {lengthOf, minusOneToUndefined} from './utils';
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
 * If you need to both filter and map over an array, consider using the filterMap function.
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
 * filterMap executes mapper function over filtered input array or monad and outputs the resulting array or monad.
 *
 * Only one pass through the array is executed unlike the use of map(mapper)(filter(checker)(list)).
 *
 * filterMap can be called both as a curried unary function or as a standard ternary function.
 *
 * @HindleyMilner filterMap :: (a -> boolean) -> (a -> b) -> [a] -> [b]
 *
 * @pure
 * @param {function} checker
 * @param {function} mapper
 * @param {array} list
 * @return {*}
 *
 * @example
 * import {filterMap} from '@7urtle/lambda';
 *
 * const list = [0, 1, 2, 3]
 * const mapper = a => a + 1;
 * const checker = a => a > 1;
 *
 * filterMap(checker)(mapper)(list);  // => [3, 4]
 * filterMap(a => a > 1)(a => a + 1)([0, 1, 2, 3]); // => [3, 4]
 *
 * const mapOverLargerThanOne = filterMap(checker);
 * mapOverLargerThanOne(mapper)(list); // => [3, 4]
 *
 * // filterMap can be called both as a curried unary function or as a standard ternary function
 * filterMap(a => a > 1)(a => a + 1)(list) === filterMap(a => a > 1, a => a + 1, list);
 */
export const filterMap = nary(checker => mapper => list =>
    reduce([])((acc, current) => checker(current) ? acc.push(mapper(current)) && acc : acc)(list));

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
 * slice outputs selected array elements as an array based on input range. First argument end
 * represents the ending index (not length) and start represents the starting index in the input
 * array list.
 *
 * slice can be called both as a curried unary function or as a standard ternary function.
 *
 * @HindleyMilner slice :: number -> number -> [a] -> [a]
 *
 * @pure
 * @param {number} end
 * @param {number} start
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
 * // sort can be called both as a curried unary function or as a standard binary function
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

/**
 * headOf outputs the first item (head) from the input array.
 *
 * @HindleyMilner headOf :: [a] -> a
 *
 * @pure
 * @param {array} list
 * @return {any}
 *
 * @example
 * import {headOf} from '@7urtle/lambda';
 *
 * headOf([3, 4, 1, 8]); // => 3
 * headOf([8]); // => 8
 * headOf([]); // => undefined
 */
export const headOf = list => list[0];

/**
 * tailOf outputs the the input array without its first item.
 *
 * @HindleyMilner tailOf :: [a] -> []
 *
 * @pure
 * @param {array} list
 * @return {array}
 *
 * @example
 * import {tailOf} from '@7urtle/lambda';
 *
 * tailOf([3, 4, 1, 8]); // => [4, 1, 8]
 * tailOf([8]); // => []
 * tailOf([]); // => []
 */
export const tailOf = list => list.slice(1);

/**
 * initOf outputs the the input array without its last item.
 *
 * @HindleyMilner initOf :: [a] -> []
 *
 * @pure
 * @param {array} list
 * @return {array}
 *
 * @example
 * import {initOf} from '@7urtle/lambda';
 *
 * initOf([3, 4, 1, 8]); // => [3, 4, 1]
 * initOf([8]); // => []
 * initOf([]); // => []
 */
export const initOf = list => slice(lengthOf(list) -1)(0)(list);

/**
 * lastOf outputs the last item from the input array.
 *
 * @HindleyMilner lastOf :: [a] -> a
 *
 * @pure
 * @param {array} list
 * @return {any}
 *
 * @example
 * import {lastOf} from '@7urtle/lambda';
 *
 * lastOf([3, 4, 1, 8]); // => 8
 * lastOf([3]); // => 3
 * lastOf([]); // => undefined
 */
export const lastOf = list => list[lengthOf(list) -1];

/**
 * groupBy outputs an objects with groups produced by an input function over input list.
 *
 * groupBy can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner groupBy :: (a -> b) -> [a] -> {b: a}
 *
 * @pure
 * @param {function} fn
 * @param {array} list
 * @return {object}
 *
 * @example
 * import {groupBy} from '@7urtle/lambda';
 *
 * groupBy(a => a.length)(['one', 'two', 'three']);
 * // => {"3": ["one", "two"], "5": ["three"]}
 *
 * groupBy(a => a % 2)([1, 2, 3]);
 * // =>  {"0": [2], "1": [1, 3]}
 *
 * // groupBy can be called both as a curried unary function or as a standard binary function
 * groupBy(a => a.length)(['one', 'two', 'three']) === groupBy(a => a.length, ['one', 'two', 'three'])
 */
export const groupBy = nary(fn => list =>
    reduce
    ({})
    ((acc, current) =>
        (acc[fn(current)] = acc[fn(current)] || []).push(current) && acc
    )
    (list));

/**
 * randomOf outputs a random item from the input array.
 *
 * @HindleyMilner randomOf :: [a] -> a
 *
 * @pure
 * @param {array} list
 * @return {any}
 *
 * @example
 * import {randomOf} from '@7urtle/lambda';
 *
 * randomOf([3, 4, 1, 8]); // => 8
 * randomOf([3]); // => 3
 * randomOf([]); // => undefined
 */
export const randomOf = list => list[Math.floor(Math.random() * lengthOf(list))];