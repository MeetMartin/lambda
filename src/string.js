import {minusOneToUndefined} from './utils';
import {nary} from "./arity";

/**
 * trim output is a string without white characters around it.
 *
 * @HindleyMilner trim :: string -> string
 *
 * @pure
 * @param {string} string
 * @return {string}
 *
 * @example
 * import {trim} from '@7urtle/lambda';
 *
 * trim(' a \n '); // => 'a'
 */
export const trim = string => string.trim();

/**
 * testRegEx outputs true if string b passes regular expression a.
 *
 * testRegEx can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner testRegEx :: regex -> string -> boolean
 *
 * @pure
 * @param {regex} regex
 * @param {string} string
 * @return {boolean}
 *
 * @example
 * import {testRegEx} from '@7urtle/lambda';
 *
 * testRegEx(/[a-z]/)('7urtle'); // => true
 * testRegEx(/[0-9]/)('1'); // => true
 * testRegEx(/[0-9]/)('abc'); // => false
 *
 * // testRegEx can be called both as a curried unary function or as a standard binary function
 * testRegEx(/[a-z]/)('7urtle') === testRegEx(/[a-z]/, '7urtle');
 */
export const testRegEx = nary(regex => string => regex.test(string));

/**
 * substr outputs substring based on provided string, start and limit.
 *
 * substr can be called both as a curried unary function or as a standard ternary function.
 *
 * @HindleyMilner substr :: number -> number -> string -> string
 *
 * @pure
 * @param {number} limit
 * @param {number} start
 * @param {string} string
 * @return {string}
 *
 * @example
 * import {substr} from '@7urtle/lambda';
 *
 * substr(3)(1)('7urtle'); // => 'urt'
 * substr(1)(0)('7urtle'); // => '7'
 * substr(1)(-1)('7urtle'); // => 'e'
 *
 * // substr can be called both as a curried unary function or as a standard ternary function
 * substr(3)(1)('7urtle') === substr(3, 1, '7urtle');
 */
export const substr = nary(limit => start => string => string.substr(start, limit));

/**
 * firstLetterOf outputs the first letter of a provided string.
 *
 * @HindleyMilner firstLetterOf :: string -> string
 *
 * @pure
 * @param {string} string
 * @return {string}
 *
 * @example
 * import {firstLetterOf} from '@7urtle/lambda';
 *
 * firstLetterOf('7urtle'); // => '7'
 */
export const firstLetterOf = string => string.substr(0, 1);

/**
 * lastLetterOf outputs the last letter of a provided string.
 *
 * @HindleyMilner lastLetterOf :: string -> string
 *
 * @pure
 * @param {string} string
 * @return {string}
 *
 * @example
 * import {lastLetterOf} from '@7urtle/lambda';
 *
 * lastLetterOf('7urtle'); // => 'e'
 */
export const lastLetterOf = string => string.substr(-1, 1);

/**
 * startsWith outputs true if an input string starts with provided string.
 *
 * startsWith can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner startsWith :: string -> string -> boolean
 *
 * @pure
 * @param {string} substring
 * @param {string} string
 * @return {boolean}
 *
 * @example
 * import {startsWith} from '@7urtle/lambda';
 *
 * startsWith('7')('7urtle'); // => true
 * startsWith('7urtl')('7urtle'); // => true
 * startsWith('8urtl')('7urtle'); // => false
 *
 * // startsWith can be called both as a curried unary function or as a standard binary function
 * startsWith('7')('7urtle') === startsWith('7', '7urtle');
 */
export const startsWith = nary(substring => string => string.startsWith(substring));

/**
 * endsWith outputs true if an input string ends with provided string.
 *
 * endsWith can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner endsWith :: string -> string -> boolean
 *
 * @pure
 * @param {string} substring
 * @param {string} string
 * @return {boolean}
 *
 * @example
 * import {endsWith} from '@7urtle/lambda';
 *
 * endsWith('7e')('7urtle'); // => true
 * endsWith('urtle')('7urtle'); // => true
 * endsWith('urtls')('7urtle'); // => false
 *
 * // endsWith can be called both as a curried unary function or as a standard binary function
 * endsWith('e')('7urtle') === endsWith('e', '7urtle');
 */
export const endsWith = nary(substring => string => string.endsWith(substring));

/**
 * repeat outputs new string repeating input string inputted count of times.
 *
 * repeat can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner repeat :: number -> string -> string
 *
 * @pure
 * @param {number} count
 * @param {string} string
 * @return {string}
 *
 * @example
 * import {repeat} from '@7urtle/lambda';
 *
 * repeat(2)('7urtle'); // => '7urtle7urtle'
 * repeat(0)('7urtle'); // => ''
 *
 * // repeat can be called both as a curried unary function or as a standard binary function
 * repeat(2)('7urtle') === repeat(2, '7urtle');
 */
export const repeat = nary(count => string => string.repeat(count));

/**
 * replace outputs new string replacing input substring with input replacement string in input string.
 *
 * replace can be called both as a curried unary function or as a standard ternary function.
 *
 * @HindleyMilner replace :: string -> string -> string -> string
 *
 * @pure
 * @param {string} replacement
 * @param {string} substring
 * @param {string} string
 * @return {string}
 *
 * @example
 * import {replace} from '@7urtle/lambda';
 *
 * replace('8')('7')('7urtle'); // => '8urtle'
 * replace('7')('')('7urtle'); // => '77urtle'
 * replace('')('7')('7urtle'); // => 'urtle'
 *
 * // replace can be called both as a curried unary function or as a standard ternary function
 * replace('8')('7')('7urtle') === replace('8', '7', '7urtle');
 */
export const replace = nary(replacement => substring => string => string.replace(substring, replacement));

/**
 * search outputs position of input substring or regular expression withing input string or undefined if it is not found.
 *
 * search can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner search :: string/regex -> string -> number
 *
 * @pure
 * @param {string|regex} substring
 * @param {string} string
 * @return {number}
 *
 * @example
 * import {search} from '@7urtle/lambda';
 *
 * search('7')('7urtle'); 0
 * search('e')('7urtle'); // => 5
 * search('rt')('7urtle'); // => 2
 * search(/URT/i)('7urtle'); // => 1
 * search('8')('7urtle'); => undefined
 *
 * // search can be called both as a curried unary function or as a standard binary function
 * search('7')('7urtle') === search('7', '7urtle');
 */
export const search = nary(substring => string => minusOneToUndefined(string.search(substring)));

/**
 * split outputs and array of an input string split by the input substring.
 *
 * split can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner split :: string -> string -> array
 *
 * @pure
 * @param {string} substring
 * @param {string} string
 * @return {array}
 *
 * @example
 * import {split} from '@7urtle/lambda';
 *
 * split(' ')('7urtles are awesome'); // => ['7urtles', 'are', 'awesome']
 * split('/')('7urtles are awesome'); // => ['7urtles are awesome']
 *
 * // split can be called both as a curried unary function or as a standard binary function
 * split(' ')('7urtles are awesome') === split(' ', '7urtles are awesome');
 */
export const split = nary(substring => string => string.split(substring));

/**
 * lowerCaseOf outputs the lower case version of input string.
 *
 * @HindleyMilner lowerCaseOf :: string -> string
 *
 * @pure
 * @param {string} string
 * @return {string}
 *
 * @example
 * import {lowerCaseOf} from '@7urtle/lambda';
 *
 * lowerCaseOf('PeTrA'); // => 'petra'
 * lowerCaseOf('PŘÍŠERNĚ ŽLUŤOUČKÝ KŮŇ ÚPĚL ĎÁBELSKÉ ÓDY'); // => 'příšerně žluťoučký kůň úpěl ďábelské ódy'
 */
export const lowerCaseOf = string => string.toLowerCase();

/**
 * upperCaseOf outputs the upper case version of input string.
 *
 * @HindleyMilner upperCaseOf :: string -> string
 *
 * @pure
 * @param {string} string
 * @return {string}
 *
 * @example
 * import {upperCaseOf} from '@7urtle/lambda';
 *
 * upperCaseOf('PeTrA'); // => 'PETRA'
 * upperCaseOf('příšerně žluťoučký kůň úpěl ďábelské ódy'); // => 'PŘÍŠERNĚ ŽLUŤOUČKÝ KŮŇ ÚPĚL ĎÁBELSKÉ ÓDY'
 */
export const upperCaseOf = string => string.toUpperCase();