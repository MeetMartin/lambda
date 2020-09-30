import {deepInspect} from "./utils";
import {isUndefined} from "./conditional";

/**
 * Case is a monad that helps you with conditional processing.
 *
 * Case expects an array of key-value pairs as its input. Case.match then matches against a key to provide its value.
 *
 * Case is internally build on a JavaScript map and turns it into an applicative functor monad.
 *
 * @example
 * import {Case, upperCaseOf, liftA2} from '@7urtle/lambda';
 *
 * // in the example we define Case using key-value pairs. Case.of() outputs an instance of Case.
 * const myCase = Case.of([[1, 'one'], ['key', 'value'], ['_', 'fallback']);
 *
 * // you reach a value by matching keys using Case.match
 * myCase.match(1); // => 'one'
 * myCase.match('key'); // => 'value'
 * myCase.match('nope'); // => 'fallback'
 *
 * // if no fallback is defined and no key is matched, we return undefined
 * Case.of([]).match('nope'); // => undefined
 *
 * // you can also inspect it by
 * myCase.inspect(); // => 'Case(...
 *
 * // as a functor the result is safely mappable (map doesn't execute over undefined matches)
 * myCase.map(value => upperCaseOf(value)).match('key'); // => 'VALUE'
 * Case.of([]).map(upperCaseOf).match('key'); // => undefined
 *
 * // as a monad Case can be safely flat mapped with other Cases (flatMap doesn't execute over undefined)
 * Case.of([[1, 'I am']]).flatMap(a => Case.of([[1, a + ' a turtle']]).match(1); // => 'I am a turtle'
 * Case.of([[1, 'I am']]).flatMap(a => Case.of([])).match(1); // => undefined
 *
 * // as an applicative functor you can apply Cases to each other especially using liftA2 or liftA3
 * const add = a => b => a + b;
 * liftA2(add)(Case.of([[1, 1]))(Case.of([[1, 2]])).match(1); // => 3
 * Case.of([[1, add]]).ap(Case.of([[1, 'I am']])).ap(Case.of([[1, ' a turtle']])).match(1); // => 'I am a turtle'
 * Case.of([[1, add]]).ap(Case.of([])).ap(Case.of([[1, 'I am']])).match(1); // => undefined
 */
export const Case = {
  of: match => getCase((match => a => match.get(a) || match.get('_') || undefined)(new Map(match)))
};

const getCase = match => ({
  match: match,
  inspect: () => `Case(${deepInspect(match)})`,
  map: fn => getCase(a => (result => isUndefined(result) ? result : fn(result))(match(a))),
  flatMap: fn => getCase(a => (result => isUndefined(result) ? undefined : result.match(a))(getCase(match).map(fn).match(a))),
  ap: f => getCase(match).flatMap(fn => f.map(fn))
});